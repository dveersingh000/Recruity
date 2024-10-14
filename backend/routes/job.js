const express = require("express");
const router = express.Router();
const { Job } = require("../schema/job.schema");
const authMiddleware = require("../middleware/auth");
// const { check, validationResult } = require("express-validator");
const isAuth = require("../utils/index");

// create a new job
router.post(("/"), 

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
        const isAuthenticated = isAuth(req);
        const jobs = isAuthenticated ? await Job.find() : await Job.find().select("-_id -creator -about -information");
        res.status(200).json({jobs});
    })

    router.get(("/:id"), authMiddleware, async (req, res) => {
        const {id} = req.params;
        const job = await Job.findById(id);
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }
        res.status(200).json({job});
    })

    // delete a job
    router.delete("/:id", authMiddleware, async (req, res) => {
        const {id} = req.params;
        const job = await Job.findById(id);
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }
        if(job.creator.toString() !== req.user){
            return res.status(401).json({message: "You are not authorized to delete this job"});
        }
        await Job.findByIdAndDelete(id);
        res.status(200).json({message: "Job deleted successfully"});
    })

    // update a job
    router.put("/:id", authMiddleware, async (req, res) => {
        try{
            const {id} = req.params;
        const {name, logo, position, salary, jobType, remote, location, description, about, skills, information } = req.body;
        const jobs = skills?.split(",").map((skill) => skill.trim());
        const job = await Job.findByIdAndUpdate(id, {name, logo, position, salary, jobType, remote, location, description, about, skills: jobs, information}, {new: true});
        // job.save();
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }
        if(job.creator.toString() !== req.user.toString()){
            return res.status(401).json({message: "You are not authorized to update this job"});
        }
        
        res.status(200).json(job);
        }
        catch(err){
            console.log(err);
            res.status(400).json({message: "Job not updated"});
        }
    })

    //search by title
    router.get(("/search/:title"), async (req, res) => {
        const {title} = req.params;
        const jobs = await Job.find({name: new RegExp(title, "i")}.select("-_id -creator -about -information"));
        res.status(200).json({jobs});
    })

    // TODO: add skills also
    

module.exports = router;