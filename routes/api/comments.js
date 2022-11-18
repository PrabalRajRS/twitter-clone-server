const express = require("express");
const router = express.Router();
const Comment = require("../../models/Comment");
const multer = require("multer");

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find({}).sort('-date')
        res.send({ comments })
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const comments = await Comment.findById(req.params.id).populate("userData");
        res.send({ comments });
    } catch (err) {
        res.status(404).send({ message: 'Comment not found!' });
    }
});


router.post('/', async (req, res) => {
    try {
        const comments = await Comment.create({
            userId: req.body.userId,
            postId: req.body.postId,
            text: req.body.text
        });
        res.send({ comments });
        console.log(res)
    } catch (err) {
        res.status(400).send({ error: err });
    }
})

module.exports = router;