const AdminModel = require("../models/admin");
const HoDModel = require("../models/HoD");
const StudentModel = require("../models/student");
const CompanyModel = require("../models/company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class FrontController {
  static home = async (req, res) => {
    try {
      // res.send("home page")
      res.render("home");
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      res.render("ABOUT");
    } catch (error) {
      console.log(error);
    }
  };

  static login = async (req, res) => {
    try {
      res.render("Login", { 
        msg: req.flash("error"),
        success: req.flash("success")  // means success flash message will get stored in success and then in login.ejs this will go as success
    });
    } catch (error) {
      console.log(error);
    }
  };

  static register = async (req, res) => {
    try {
      res.render("Register");
    } catch (error) {
      console.log(error);
    }
  };

  static dashboard = async (req, res) => {
    try {
      // console.log(req.user)
      const id = req.user.id
      // console.log(id)
      // const user = await AdminModel.findById(id)
      // console.log(user)
      res.render("Dashboard", {
      });
    } catch (error) {
      console.log(error);
    }
  };

  static registerAdmin = async (req, res) => {
    try {
      // console.log(req.body)
      const { name, email, password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const result = await AdminModel.create({
        name,
        email,
        password: hashPassword,
      });
      res.redirect("/login"); //web.js ke andar jaayega
    } catch (error) {
      console.log(error);
    }
  };

  // static verifyLogin = async(req,res)=>{
  //     try{
  //         // console.log(req.body)
  //         const {email,password,role} = req.body
  //         const user = await AdminModel.findOne({email})
  //         // console.log(user)
  //         if(!user){
  //             req.flash("error","You are not registered User")
  //             return res.redirect("/login")
  //         }else{
  //             const isMatch = await bcrypt.compare(password,user.password)
  //             // console.log(isMatch)
  //             if(isMatch){
  //                 return res.redirect('/dashboard')
  //             }else{
  //                 req.flash("error","Email or Password Not Matched")
  //                 return res.redirect("/login")
  //             }
  //         }
  //     }
  //     catch(error){
  //         console.log(error)
  //     }
  // }

  static verifyLogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { email, password, role } = req.body;
      if (!role) {
        req.flash("error", "Please select your role");
        return res.redirect("/login");
      }
      let user;

      switch (role) {
        case "admin":
          user = await AdminModel.findOne({ email });
          break;
        case "hod":
          user = await HoDModel.findOne({ email });
          break;
        case "company":
          user = await CompanyModel.findOne({ email });
          break;
        case "student":
          user = await StudentModel.findOne({ email });
          break;
        default:
          req.flash("error", "Invalid role selected");
          return res.redirect("/login");
      }
      if (!user) {
        req.flash("error", "User not registered");
        return res.redirect("/login");
      }
      // console.log(user);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash("error", "Email or Password not match");
        return res.redirect("/login");
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: role, name: user.name },
        process.env.jwt_secret_key, // secret key — ise environment variable me rakhna best practice hai
        { expiresIn: "1d" }
      );
      //   console.log(token);

      // Store token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      }); // 1 day
      // 1 day = 24 hours = 24 * 60 minutes = 24 * 60 * 60 seconds = 86400 seconds
      // 24 hours 60 minutes per hour 60 seconds per minute 1000 milliseconds per second
      // 1 din ke milliseconds — yani 86,400,000 milliseconds.
      // httpOnly: true matlab ye cookie sirf backend ke liye accessible hai (JavaScript se nahi)
      // Cookie = Browser mein chhoti file (data snippet) jo website ke liye info rakhti hai.
      // Session = Server side memory jo user ke info ko temporarily store karta hai.
      // JWT in cookie = Secure token jo user ke identity ko verify karta hai, aur cookie ke through har request mein backend ko bheja jaata hai.

      return res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      req.flash("success", "Logged Out Successfully");
      res.redirect("/login");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
