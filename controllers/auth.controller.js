const { User, Otp, RefreshToken } = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

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
        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_SECRET,
            { expiresIn: '15m' }
        )
        const refrehToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_SECRET,
            { expiresIn: '7d' }
        )

        await RefreshToken.create({
            user_id: user.id,
            token: refrehToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        await otp.destroy()

        return res.json({
            message: "Connexion réussie",
            accessToken,
            refreshToken
        });
    } catch (error) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    register,
    login,
    verifyOtp
}