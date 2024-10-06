const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { User } = require("../schema/user.schema");

// register an user
router.post(("/register"), async (req, res) => {
    const {name, email, password } = req.body;
    console.log(name, email, password);
    const ifUserExists = await User.findOne({email});
    if(ifUserExists){
        return res.status(400).json({message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashedPassword});
    await user.save();
    res.status(201).json({message: "User created successfully"});
})

router.get(("/"), async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json({users});
    // const userList =  users.map((user) => {
    //     return {
    //         name: user.name,
    //         email: user.email,
    //         creationDate: user.creationDate
    //     }
    // })
    // res.send(userList);
})

router.get(("/:email"), async (req, res) => {
    const {email} = req.params;
    const user = await User.findOne({email}).select("-password");
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    res.status(200).json({user});
})

module.exports = router;