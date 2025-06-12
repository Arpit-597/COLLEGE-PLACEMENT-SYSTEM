const JobModel = require("../models/job");

class JobController {
  static AllJobs = async (req, res) => {
    try {
      const alljobs = await JobModel.find({ companyId: req.user.id })
        .populate("companyId", "name")
        .sort({ createdAt: -1 });
      // console.log(alljobs)

      res.render("job/AllJobs", {
        success: req.flash("success"),
        error: req.flash("error"),
        alljobs,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static AddJob = async (req, res) => {
    try {
      // console.log(req.body)
      const {
        title,
        description,
        location,
        salary,
        department,
        jobType,
        applicationDeadline,
        min10Percent,
        min12Percent,
        minCGPA,
        maxBacklogs,
        allowedBranches,
        skillsRequired,
      } = req.body;
      // console.log(req.body)

      const newJob = new JobModel({
        title,
        description,
        location,
        salary,
        department,
        jobType,
        applicationDeadline,
        companyId: req.user.id,
        requirements: {
          min10Percent,
          min12Percent,
          minCGPA,
          maxBacklogs,
          allowedBranches: allowedBranches
            ?.split(",")
            .map((branch) => branch.trim()),
          skillsRequired: skillsRequired
            ?.split(",")
            .map((skills) => skills.trim()),
        },
      });

      await newJob.save();
      req.flash("success", "Job insert successfully");
      res.redirect("/company/jobs"); // redirect to posted jobs page
    } catch (error) {
      console.log(error);
    }
  };

  static updateJob = async (req, res) => {
    try {
      // console.log(req.body)
      const id = req.params.id;
      const {
        title,
        description,
        location,
        salary,
        department,
        jobType,
        applicationDeadline,
        min10Percent,
        min12Percent,
        minCGPA,
        maxBacklogs,
        allowedBranches,
        skillsRequired,
      } = req.body;

      const updateData = {
        title,
        description,
        salary,
        location,
        department,
        requirements: {
          min12Percent: Number(min12Percent),
          minCGPA: Number(minCGPA),
          maxBacklogs: Number(maxBacklogs),
          skillsRequired: skillsRequired
            ? skillsRequired.split(",").map((skill) => skill.trim())
            : [],
          allowedBranches: allowedBranches
            ? allowedBranches.split(",").map((branch) => branch.trim())
            : [],
        },
      };

      await JobModel.findByIdAndUpdate(id, updateData);
      req.flash("success", "Job Updated successfully");
      res.redirect("/company/jobs"); // Redirect to jobs list page
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  };

  static deleteJob = async (req, res) => {
    try {
      const jobId = req.params.id;
      await JobModel.findByIdAndDelete(jobId);
      // Redirect back to jobs listing page after delete
      req.flash("success", "Job delete successfully");

      res.redirect("/company/jobs");
    } catch (error) {
      console.log(error);
    }
  };

  static showJobsForStudent = async (req, res) => {
    try {
      //Yahan simple sa filter laga sakte ho, jaise status open
      const jobs = await JobModel.find({ status: "open" })
        .populate("companyId", "name")
        .sort({ createdAt: -1 });
      // console.log(jobs);
      res.render("students/jobsList", {
        jobs,
        studentId: req.user.id,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = JobController;
