const StudentModel = require("../models/student");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");

//setup
cloudinary.config({
  cloud_name: "ddxdxst4k",
  api_key: "713535443456214",
  api_secret: "WITOG14o78cRWah2Gy1TSscnRsc",
});

class StudentController {
  static display = async (req, res) => {
    try {
      const student = await StudentModel.find().sort({ _id: -1 });
      // console.log(student)
      res.render("students/display", {
        error: req.flash("error"),
        success: req.flash("success"),
        std: student,
      }); //folder(student) -> file(display.ejs)
    } catch (error) {
      console.log(error);
    }
  };

  static insertStudent = async (req, res) => {
    try {
      // console.log(req.body.files)
      // console.log(req.files)
      // console.log(req.body)
      const {
        rollNumber,
        name,
        address,
        gender,
        email,
        dob,
        phone,
        branch,
        semester,
        password,
      } = req.body;
      const exisitingStudent = await StudentModel.findOne({ email });
      const exisitingRoll = await StudentModel.findOne({ rollNumber });
      if (exisitingStudent) {
        req.flash("error", "Email already Registered");
        return res.redirect("/student/display");
      }
      if (exisitingRoll) {
        req.flash("error", "RollNo already Registered");
        return res.redirect("/student/display");
      }

      //image upload
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "student_images",
      });
      // console.log(imageUpload);

      const hashPassword = await bcrypt.hash(password, 10);
      const result = await StudentModel.create({
        rollNumber,
        name,
        address,
        gender,
        email,
        dob,
        phone,
        branch,
        semester,
        password: hashPassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      req.flash("success", "Student registered Successfully");
      return res.redirect("/student/display");
    } catch (err) {
      console.log(err);
    }
  };

  static StudentDelete = async (req, res) => {
    try {
      const id = req.params.id;
      const student = await StudentModel.findById(id);
      const imageID = student.image.public_id;
      // console.log(id)
      if (student.image && student.image.public_id) {
        await cloudinary.uploader.destroy(imageID);
      }
      await StudentModel.findByIdAndDelete(id);
      req.flash("success", "Student Deleted Successfully");
      return res.redirect("/student/display");
    } catch (error) {
      console.log(error);
    }
  };

  static StudentView = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      const view = await StudentModel.findById(id);
      // console.log(view)
      // req.flash("success", "Student Deleted Successfully");
      return res.render("students/view", {
        view,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static StudentEdit = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      const edit = await StudentModel.findById(id);
      // console.log(view)
      // req.flash("success", "Student Deleted Successfully");
      return res.render("students/edit", {
        edit,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static StudentUpdate = async (req, res) => {
    try {
      const id = req.params.id;
      const {
        rollNumber,
        name,
        address,
        gender,
        email,
        dob,
        phone,
        branch,
        semester,
      } = req.body;
      if (req.files) {
        // agr image aa rhi hogi toh isme jaayegi vrna nhi jaayegi
        const student = await StudentModel.findById(id);
        const imageID = student.image.public_id;
        // console.log(imageID);

        //deleting image from Cloudinary
        if (student.image && student.image.public_id) {
          await cloudinary.uploader.destroy(imageID);
        }

        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "student_images",
          }
        );

        var data = {
          rollNumber,
          name,
          address,
          gender,
          email,
          dob,
          phone,
          branch,
          semester,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          rollNumber,
          name,
          address,
          gender,
          email,
          dob,
          phone,
          branch,
          semester,
        };
      }
      await StudentModel.findByIdAndUpdate(id, data);
      req.flash("success", "Profile Updated successfully");
      res.redirect("/student/display");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = StudentController;
