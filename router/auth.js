const router = require("express").Router()
const user_model = require("../models/user.model")
const bcrypt = require("bcrypt")


// REGISTER
router.post("/register", async (req, res) => {
    try {
        // yangi parol yaratish
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // user malumotlarini bazaga saqlash
        const new_user = await user_model.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
        })
        return res.status(201).json(new_user)
    } catch (error) {
        return res.status(500).json(error)
    }
})


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const find_user = await user_model.findOne({ email: req.body.email })
        if (!find_user) return res.status(404).json({ message_error: "User not found" })
        const valid_user = await bcrypt.compare(req.body.password, find_user.password)
        if (!valid_user) return res.status(400).json({ message_error: "Wrong password" })
        res.status(200).json(find_user)
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = router