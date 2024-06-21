const mongoose = require('mongoose')

const post_schema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },

}, { timestamps: true, })

module.exports = mongoose.model("post", post_schema)