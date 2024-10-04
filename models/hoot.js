const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    // 1 to many relationship between user and hoots
    // 1 user has many hoots, hoot belongs to a user
    // We are setting the relationship on the many side.
    // referencing!
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
})

const hootSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enums: ["News", "Sports", "Games", "Movies", "Music", "Television"]
    },
    // 1 to many relationship between user and hoots
    // 1 user has many hoots, hoot belongs to a user
    // We are setting the relationship on the many side.
    // referencing
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // embedding
    // 1 hoot has many comments, comment belongs to A hoot.
    comments: [commentSchema]
})

module.exports = mongoose.model('Hoot', hootSchema)