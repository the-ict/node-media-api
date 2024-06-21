const router = require("express").Router()
const post_model = require("../models/post.model")
const user_model = require("../models/user.model")

// create a post
router.post("/", async (req, res) => {
    try {
        const post = await post_model.create(req.body)
        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await post_model.findOne({ _id: req.params.id })
        if (req.body.user_id == post.user_id) {
            const update_post = await post.updateOne({
                $set: req.body
            }, { new: true })
            return res.status(200).json({message: "user data is updated"})
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})
// delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await post_model.findOne({ _id: req.params.id })
        if (req.body.user_id === post.user_id) {
            await post.deleteOne()
            res.status(200).json({ message: "Post o'chirib tashlandi !" })
        } else {
            return res.status(405).json({ message: "siz faqat o'zingizni postingizni o'chirib tashlay olasiz!" })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})
// like a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await post_model.findById(req.params.id)
        if (!post.likes.includes(req.body.user_id)) {
            await post.updateOne({
                $push: {
                    likes: req.body.user_id
                }
            })
            res.status(200).json({message: "siz like bosdingiz"})
        } else {
            return res.status(405).json({ message: "siz avval like bosgansiz" })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

// unlike a post
router.put("/:id/unlike", async (req, res) => {
    try {
        const post = await post_model.findById(req.params.id)
        if (post.likes.includes(req.body.user_id)) {
            await post.updateOne({
                $pull: {
                    likes: req.body.user_id
                }
            })
            res.status(200).json({message: "siz likeni qaytarib oldingiz"})
        } else {
            return res.status(405).json({ message: "siz avval like bosmagansiz" })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})
// get one post
router.get("/:id", async (req, res) => {
    try {
        const post = await post_model.findOne({ _id: req.params.id })
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json(error)
    }
})
// timeline
// router.get("/timeline", async (req, res) => {
//     try {
//         const current_user = await user_model.findById(req.body.user_id)
//         const user_posts = await post_model.find({ user_id: current_user._id })
//         const friend_posts = await Promise.all(current_user.followings.map(friend_id => {
//             post_model.findOne({ user_id: friend_id })
//         }))
//         res.json(user_posts.concat(...friend_posts))
//     } catch (error) {
//         return res.status(500).json(error)
//     }
// })


module.exports = router