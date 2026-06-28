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
        req.user = {
            id: user.id,
            compagny_id: user.compagny_id,
            agency_id: user.agency_id,
            role: user.Role?.name
        }

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

        if (!roles.includes(req.user.role)) {
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