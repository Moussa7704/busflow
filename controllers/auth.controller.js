const { User } = require("../models")
const bcrypt = require("bcrypt")

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

module.exports = {
    register
}