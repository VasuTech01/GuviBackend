const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const auth = require("../middlewares/auth");
router.post("/user/signup",async (req, res) => {
    const body = req.body;
    const user = new User(body);
    try {
        const token = await user.getAuthToken();
        req.session.userToken = token;
        res.status(200).send({ user,token,session:req.session});
    } catch (e) {
       
        res.status(200).send({error:e.message});
    }
})
router.post("/user/login", async (req, res) => {
    
    const { email, password } = req.body;
    try {
        const user = await User.findByCredentials(email, password);
     
        if (!user.msg) {
            console.log(user);
            throw new Error(user.error);
        }
        const token = await user.user.getAuthToken();
        console.log(token);
        res.status(200).send({ user:user.user,token,session:req.session});
    } catch (e) {
        console.log(e.message);
        res.status(200).send({error:e.message});
    }
})
router.patch("/user/me",auth,async (req, res) => {
    const body = req.body;
    console.log("body", body);
    const updates = Object.keys(body);
    updates.forEach((u) => {
        req.user[u] = body[u];
    })
    console.log(req.user);
    try {
       const user= await User.updateOne({ email: body.email }, req.user);
        // await req.user.save();
        res.status(200).send({ user:req.user,session:req.session});
    } catch (e) {
        res.status(404).send(e);
    }
})
router.post("/user/logout", auth, async (req, res) => {
    console.log("Logging Out USer");
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });
        console.log(req.user);
      await req.user.save();
      res.send(req.user);
    } catch (e) {
        console.log(e);
      res.status(500).send("Error hai error");
    }
  });
module.exports = router;