const express = require("express");
const router = express.Router();
const { Job } = require("../schema/job.schema");
const authMiddleware = require("../middleware/auth");
// const { check, validationResult } = require("express-validator");

// create a new job
router.post(("/create"), 

    // validation
    // [
    // check("name","Name is required").notEmpty(),
    // check("logo","Logo is required").notEmpty(),
    // check("position","Position is required").notEmpty(),
    // check("salary","Salary is required").notEmpty(),
    // check("jobType","Job Type is required").notEmpty(),
    // check("remote","Remote is required").notEmpty()
    // ], 
    authMiddleware, async (req, res) => {
    // Handle validation errors
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors: errors.array()});
    // }
    try{
        const {name, logo, position, salary, jobType, remote, location, description, about, skills, information } = req.body;
        const {user} = req;
        const jobs = skills.split(",").map((skill) => skill.trim());
        const job = new Job({name, logo, position, salary, jobType, remote, location, description, about, skills: jobs, information, creator: user});
        await job.save();
        res.status(201).json({message: "Job created successfully"});
        }
        catch(err){
            console.log(err);
            res.status(400).json({message: "Job not created"});
        }
    })

    // get all jobs
    router.get(("/"), async (req, res) => {
        const jobs = await Job.find().select("-_id -creator -__v");
        res.status(200).json({jobs});
    })
    

module.exports = router;