const express = require("express");
const route = express.Router();
const FrontController = require("../controllers/FrontController");
const StudentController = require("../controllers/StudentController");
const HodController = require("../controllers/HodController");
const CompanyController = require("../controllers/CompanyController");
const checkAuth = require("../middlewares/auth");
const JobController = require("../controllers/JobController");
// console.log(route)

route.get("/", FrontController.home);
route.get("/about", FrontController.about);
route.get("/login", FrontController.login);
route.get("/register", FrontController.register);
route.get("/dashboard", checkAuth, FrontController.dashboard);

//Student controller
route.get("/student/display", checkAuth, StudentController.display);
route.post("/student/insert", checkAuth, StudentController.insertStudent);
route.get("/studentDelete/:id", checkAuth, StudentController.StudentDelete);
route.get("/studentView/:id", checkAuth, StudentController.StudentView);
route.get("/studentEdit/:id", checkAuth, StudentController.StudentEdit);
route.post("/studentUpdate/:id", checkAuth, StudentController.StudentUpdate);

// HoD controller
route.get("/hod/display", checkAuth, HodController.display);
route.post("/hod/insert", checkAuth, HodController.insertHod);
route.get("/hodDelete/:id", checkAuth, HodController.HodDelete);
route.get("/hodView/:id", checkAuth, HodController.HodView);
route.get("/hodEdit/:id", checkAuth, HodController.HodEdit);
route.post("/hodUpdate/:id", checkAuth, HodController.HodUpdate);

//Company Controller
route.get("/company/display", checkAuth, CompanyController.display);
route.post("/company/insert", checkAuth, CompanyController.insertCompany);
route.get("/companyDelete/:id", checkAuth, CompanyController.CompanyDelete);
route.get("/companyView/:id", checkAuth, CompanyController.CompanyView);
route.get("/companyEdit/:id", checkAuth, CompanyController.CompanyEdit);
route.post("/companyUpdate/:id", checkAuth, CompanyController.CompanyUpdate);

//Job Controller
route.get("/company/jobs", checkAuth, JobController.AllJobs);
route.post("/company/jobs/add", checkAuth, JobController.AddJob);
route.post("/company/jobs/Update/:id", checkAuth, JobController.updateJob);
route.post("/company/jobs/delete/:id", checkAuth, JobController.deleteJob);

//insert admin login
route.post("/registerAdmin", FrontController.registerAdmin);
route.post("/verifyLogin", FrontController.verifyLogin);

route.get("/logout", FrontController.logout);

//Student ke liye Job List
route.get("/student/jobs", checkAuth, JobController.showJobsForStudent);

module.exports = route;
