const { verifyAccessToken } = require("../utils/jwt")
const { User } = require("../models")

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Token manquant ou invalide"
            })
        }

        const token = authHeader.split(' ')[1]
        const decoded = verifyAccessToken(token)

        const user = await User.findByPk(decoded.id, {
            include: ['Role'],
            attributes: {
                exclude: ['password']
            }
        })
        if (!user || !user.is_active) {
            return res.status(401).json({
                message: "Utilisateur introuvable ou inactif"
            })
        }

        req.user = user
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expiré"
            })
        } else {
            return res.status(401).json({
                message: "Token invalid"
            })
        }
    }
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user?.Role?.name || !roles.includes(req.user.Role.name)) {
            return res.status(403).json({
                message: "Accès refusé"
            })
        }
        next()
    }
}

module.exports = {
    authenticate,
    authorize
}