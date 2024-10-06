const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { User } = require("../schema/user.schema");
const { check, validationResult } = require("express-validator");

// register an user
router.post(("/register"), [
    // validation
    check("name","Name is required").notEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password should be at least 6 characters").isLength({min: 6})
], async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password } = req.body;
    
    const ifUserExists = await User.findOne({email});
    if(ifUserExists){
        return res.status(400).json({message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashedPassword});
    await user.save();
    res.status(201).json({message: "User created successfully"});
})

// get all users
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

// get an user by email
router.get(("/:email"), async (req, res) => {
    const {email} = req.params;
    const user = await User.findOne({email}).select("-password");
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    res.status(200).json({user});
})

// login an user
router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "Wrong email or password"});
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
        return res.status(400).json({message: "Wrong email or password"});
    }
    const payload = { id: user._id };
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({token});
})

module.exports = router;