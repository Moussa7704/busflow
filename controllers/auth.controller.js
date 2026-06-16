const { User, Otp, RefreshToken } = require("../models")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOtpEmail } = require('../utils/sendEmail');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");

const register = async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const payload = {
        compagny_id: req.body.compagny_id,
        agency_id: req.body.agency_id,
        role_id: req.body.role_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        password: hashedPassword
    }
    const user = await User.findOne({ where: { email: payload.email } })

    if (user) {
        return res.status(400).json({
            message: "lutilisateur existe déjà avec cet email"
        })
    }
    User.create(payload)
        .then(user => {
            res.status(200).json({
                message: "l'utilisateur a été créé avec succès"
            })
        })
        .catch(err => {
            res.status(400).json({ error: err.message })
        })
}

const login = async (req, res) => {
    const payload = {
        email: req.body.email,
        password: req.body.password
    }

    const user = await User.findOne({ where: { email: payload.email } })

    if (!user) {
        return res.status(400).json({
            message: "votre addresse email ou mot de passe est incorrect"
        })
    }

    const validatedPassword = await bcrypt.compare(payload.password, user.password)

    if (!validatedPassword) {
        return res.status(400).json({
            message: "votre addresse email ou mot de passe est incorrect"
        })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.create({
        user_id: user.id,
        code,
        type: "LOGIN",
        expires_at: expiresAt
    })

    res.status(200).json({
        message: "Veuillez verifier le code a 6 chiffre qui vous ete envoie votre adresse email ",
        user_id: user.id,
        email: user.email,
        expires_at: expiresAt
    });
}

const verifyOtp = async (req, res) => {
    try {
        const payload = {
            user_id: req.body.user_id,
            code: req.body.code
        }

        const otp = await Otp.findOne({ where: { user_id: payload.user_id, code: payload.code } })

        if (!otp) {
            return res.status(400).json({
                message: "Otp invalide"
            })
        }
        if (new Date() > otp.expires_at) {
            return res.status(400).json({
                message: "OTP expiré"
            });
        }
        const user = await User.findByPk(otp.user_id)

        if (!user) {
            return res.status(400).json({
                message: "Utilisateur non trouvé"
            });
        }

        //  user.is_verified = true;
        // await user.save();
        const data = { id: user.id }
        const accessToken = generateAccessToken(data)
        const refreshToken = generateRefreshToken(data)

        await RefreshToken.create({
            user_id: user.id,
            token: refreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        await otp.destroy()

        return res.json({
            message: "Connexion réussie",
            accessToken,
            refreshToken
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "No token" });
        }

        const token = await RefreshToken.findOne({
            where: { token: refreshToken, revoked: false }
        });

        if (!token) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        if (new Date() > token.expires_at) {
            return res.status(403).json({ message: "Token expired" });
        }

        const decoded = verifyRefreshToken(refreshToken)

        token.revoked = true;
        await token.save();

        const newAccessToken = generateAccessToken(decoded.id)

        res.json({
            accessToken: newAccessToken
        });
    } catch (err) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};
const logout = async (req, res) => {
    const { refreshToken } = req.body;

    await RefreshToken.update(
        { revoked: true },
        { where: { token: refreshToken } }
    );

    res.json({ message: "Logged out" });
};
const me = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "Utilisateur non authentifié"
            });
        }
        const { password, ...safeUser } = user.toJSON();
        return res.status(200).json({
            message: "Utilisateur connecté",
            data: safeUser
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
const forgetPassword = async (req, res) => {
    try {
        const payload = {
            email: req.body.email
        }

        const user = await User.findOne({ where: { email: payload.email } });
        if (!user) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé avec cette adresse email" });
        }

        // Supprimer anciens tokens
        await PasswordReset.destroy({
            where: { user_id: user.id }
        });

        // Generate a unique token for password reset
        const resetToken = generateResetToken(user.id)


        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");


        // Save the reset token in the database
        await PasswordReset.create({
            user_id: user.id,
            token: hashedToken,
            expires_at: new Date(Date.now() + 60 * 60 * 1000)
        });

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        await sendResetEmail(user.email, resetLink);

        return res.json({
            message: "Email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.",
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { token, password, confirm_password } = req.body;

        if (!token || !password || !confirm_password) {
            return res.status(400).json({ message: "Token et mot de passe requis" });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
        }

        // Vérifier et décoder le token JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.RESET_SECRET);
        } catch (err) {
            return res.status(400).json({ message: "Token invalide ou expiré" });
        }

        //Hasher le token pour comparer avec la DB
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Chercher en base
        const resetRecord = await PasswordReset.findOne({
            where: { token: hashedToken }
        });

        if (!resetRecord) {
            return res.status(400).json({ message: "Token invalide" });
        }

        // Vérifier expiration
        if (new Date() > new Date(resetRecord.expires_at)) {
            return res.status(400).json({ message: "Token expiré" });
        }

        //Trouver utilisateur
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        //Hasher nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Mise à jour
        user.password = hashedPassword;
        await user.save();

        //Supprimer le token après utilisation
        await PasswordReset.destroy({
            where: { user_id: user.id }
        });

        return res.json({ message: "Mot de passe réinitialisé avec succès" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
const resendOtp = async (req, res) => {
    try {
        const { user_id } = req.body;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(400).json({
                message: "Utilisateur non trouvé"
            });
        }

        //supprimer anciens OTP
        await Otp.destroy({
            where: { user_id }
        });

        //générer nouveau code
        const code = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        //créer nouveau OTP
        await Otp.create({
            user_id,
            type: "RESEND_OTP",
            code,
            expires_at: new Date(Date.now() + 10 * 60 * 1000)
        });

        //envoyer email ou SMS
        await sendOtpEmail(user.email, code);

        return res.json({
            message: "OTP renvoyé avec succès"
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
module.exports = {
    register,
    login,
    verifyOtp,
    refresh,
    logout,
    me,
    forgetPassword,
    resetPassword,
    resendOtp

}