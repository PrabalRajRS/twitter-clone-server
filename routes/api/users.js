const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateRegisterInput = require("./register");
const validateLoginInput = require("./login");
const User = require("../../models/User");

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

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log(isValid);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user: payload
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.get("/", async (req, res) => {
  const users = await User.find().sort('-date');
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });

})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    res.status(404).send({ message: 'News Feed not found!' });
  }
});

router.put('/profilepicture/:id', upload.any(), async (req, res) => {
  try {
    if (req.files) {
      console.log(req.files)
      const updatedUser = await User.findOneAndReplace(
        { _id: req.params.id },
        { $set: { profilePicture: req?.files[0]?.filename } },
        // profilePicture: req.files[0].filename
      );
      res.send({ updatedUser });
      // res.send({ message: 'The NewsFeed was updated' });
    }
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

router.put('/coverPhoto/:id', upload.any(), async (req, res) => {
  try {
    if (req.files) {
      console.log(req.files)
      const updatedUser = await User.findOneAndReplace(
        { _id: req.params.id },
        { $set: { coverPhoto: req?.files[0]?.filename } },
        // coverPhoto: req.files[0].filename
      );
      res.send({ updatedUser });
      // res.send({ message: 'The NewsFeed was updated' });
    }

  } catch (err) {
    res.status(400).send({ error: err });
  }
});

router.post('/follow/:id/:userid', async (req, res) => {
  console.log("req", req, res)
  const foundUser = await User.findOne({ _id: req.params.id });
  console.log("foundUser", foundUser)
  if (foundUser?.followers.includes(req.params.userid)) {
    const updatedPost = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $pullAll: { followers: [req.params.userid] } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  } else {
    const updatedPost = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { followers: req.params.userid } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  }
});

router.post('/following/:id/:userid', async (req, res) => {
  console.log("req", req)
  const foundUser = await User.findOne({ _id: req.params.id });
  console.log("foundUser", foundUser)
  if (foundUser?.following.includes(req.params.userid)) {
    const updatedPost = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $pullAll: { following: [req.params.userid] } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  } else {
    const updatedPost = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { following: req.params.userid } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  }
});


module.exports = router;
