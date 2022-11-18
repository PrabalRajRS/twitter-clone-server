const express = require("express");
const router = express.Router();
const NewsFeed = require("../../models/NewsFeed");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "../client/public/uploads");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const newsFeed = await NewsFeed.find({}).sort('-date')
        res.send({ newsFeed })
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const newsFeed = await NewsFeed.findById(req.params.id).populate("userData");
        res.send({ newsFeed });
    } catch (err) {
        res.status(404).send({ message: 'News Feed not found!' });
    }
});

router.post("/", upload.any(), async (req, res) => {
    try {
        const newsFeed = await NewsFeed.create({
            userId: req.body.userId,
            content: req.body.content || "",
            likes: req.body.likes,
            name: req.body.name,
            reTweets: req.body.retweets,
            comments: req.body.comments,
            image: await req.files.map(x => x.originalname) || []
        });
        res.send({ newsFeed });
    } catch (err) {
        res.status(400).send({ error: err });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const removeNewsFeed = await NewsFeed.findByIdAndRemove(req.params.id);
        res.send({ message: 'The NewsFeed was removed' });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.post('/likepost/:id/:userid', async (req, res) => {
    console.log("req", req, res)
    const foundPost = await NewsFeed.findOne({ _id: req.params.id });
    console.log("foundPost", foundPost)
    if (foundPost?.likes?.includes(req.params.userid)) {
        const updatedPost = await NewsFeed.findOneAndUpdate(
            { _id: req.params.id },
            { $pullAll: { likes: [req.params.userid] } },
            { new: true }
        );
        res.status(200).send(updatedPost);
    } else {
        const updatedPost = await NewsFeed.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { likes: req.params.userid } },
            { new: true }
        );
        res.status(200).send(updatedPost);
    }
});

router.post('/retweet/:id/:userid', async (req, res) => {
    const foundPost = await NewsFeed.findOne({ _id: req.params.id });
    console.log("foundPost", foundPost)
    if (foundPost?.reTweets?.includes(req.params.userid)) {
        const updatedPost = await NewsFeed.findOneAndUpdate(
            { _id: req.params.id },
            { $pullAll: { reTweets: [req.params.userid] } },
            { new: true }
        );
        res.status(200).send(updatedPost);
    } else {
        const updatedPost = await NewsFeed.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { reTweets: req.params.userid } },
            { new: true }
        );
        res.status(200).send(updatedPost);
    }
});

router.post('/comment/:id/:userId', async (req, res) => {
    console.log("res.....\n", req)
    const updatedPost = await NewsFeed.findOneAndUpdate(
        { _id: req.params.id },
        // { $push: { comments: req.body } },
        // { new: true }
    );
    updatedPost.comments.push(req.body);
    res.status(200).send(updatedPost);
    // const id = req.params.id;
    // const comment = {
    //     text: req.body.text,
    //     post: id
    // }
    // // await comment.save();
    // const postRelated = await NewsFeed.findById(id);
    // console.log("postRelated", postRelated)
    // postRelated.comments.push(comment);
    // await postRelated.save(function (err) {
    //     if (err) { console.log(err) }
    //     res.redirect('/')
    // })

})

router.delete('/:id', async (req, res) => {
    try {
        const removeNewsFeed = await NewsFeed.findByIdAndRemove(req.params.id);
        res.send({ message: 'The NewsFeed was removed' });
    } catch (err) {
        res.status(400).send({ error: err });
    }
})

module.exports = router;