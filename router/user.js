const router = require("express").Router()
const user_model = require("../models/user.model")
const bcrypt = require("bcrypt")

// update user
router.put("/:id", async (req, res) => {
    if (req.body.user_id === req.params.id || req.body.admin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(req.body.password, salt)
                req.body.password = hash
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        const updated_user = await user_model.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true })
        return res.status(200).json(updated_user)
    } else {
        return res.status(400).json("siz faqat malumotlaringizni almashtira olasiz holos")
    }
})

// delete user
router.delete("/:id", async (req, res) => {
    if (req.body.user_id == req.params.id || req.body.admin) {
        await user_model.findOneAndDelete({ _id: req.params.id })
        return res.status(200).json({ message: "user o'chirib tashlandi" })
    } else {
        return res.status(400).json("siz faqat malumotlaringizni almashtira olasiz holos")
    }
})

// get one user
router.get("/:id", async (req, res) => {
    try {
        const user = await user_model.findById(req.params.id)
        const { password, updateAt, ...other } = user._doc
        return res.status(200).json(other)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// follow user
router.put("/:id/follow", async (req, res) => {
    if (req.body.user_id !== req.params.id) {
        try {
            const user = await user_model.findById(req.params.id)
            const current_user = await user_model.findById(req.body.user_id)
            if (!current_user.followers.includes(user._id)) {
                await user_model.updateOne({ _id: current_user._id }, {
                    $push: {
                        followers: user._id
                    }
                })
                await user_model.updateOne({ _id: user._id }, {
                    $push: {
                        followings: current_user._id
                    }
                })
                res.status(200).json({ message: "siz obuna bo'ldingiz" })
            } else {
                res.status(400).json({ message: "siz allaqachon obuna bo'lgansiz" })
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        res.status(400).json({ message: "bodydagi userid va paramsdagi user id bir xil bo'lmasligi kerak !" })
    }
})

// unfollow user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.user_id !== req.params.id) {
        const user = await user_model.findById(req.params.id)
        const current_user = await user_model.findById(req.body.user_id)
        try {
            if (current_user.followers.includes(user._id)) {
                await user_model.updateOne({ _id: current_user._id }, {
                    $pull: { followers: user._id }
                })
                await user_model.updateOne({ _id: user._id }, {
                    $pull: {
                        followings: current_user._id
                    }
                })
                res.status(200).json({message: "siz obunani bekor qildingiz"})
            } else {
                res.status(400).json({ message: "siz allaqachon obuna bo'lmagansiz" })
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        res.status(400).json({ message: "bodydagi userid va paramsdagi user id bir xil bo'lmasligi kerak !" })
    }
})

module.exports = router