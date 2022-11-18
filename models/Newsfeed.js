const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsFeedSchema = new Schema({
    userId: {
        type: String,
    },
    name: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    reTweets: {
        type: Array,
        default: []
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    },
    image: {
        type: Array,
        default: [],
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
},
    {
        versionKey: false,
        timestamps: true,
    });

module.exports = NewsFeed = mongoose.model("NewsFeed", NewsFeedSchema);