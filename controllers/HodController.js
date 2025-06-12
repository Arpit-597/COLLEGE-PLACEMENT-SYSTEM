const HoDModel = require("../models/HoD");
const bcrypt = require("bcrypt");

const cloudinary = require("cloudinary");

//setup
cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

class HodController {
  static display = async (req, res) => {
    try {
      const HOD = await HoDModel.find().sort({ _id: -1 });
      // console.log(HOD)
      res.render("hod/display", {
        error: req.flash("error"),
        success: req.flash("success"),
        std: HOD,
      }); //folder(hod) -> file(display.ejs)
    } catch (error) {
      console.log(error);
    }
  };

  static insertHod = async (req, res) => {
    try {
      //   console.log(req.body);
      //   console.log(req.files.image);
      const { name, gender, department, email, phone, password } = req.body;
      const exisitingHod = await HoDModel.findOne({ email });
      if (exisitingHod) {
        req.flash("error", "HOD already Exists");
        return res.redirect("/hod/display");
      }

      //image upload
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "hod_images",
      });
      //   console.log(imageUpload);

      const hashPassword = await bcrypt.hash(password, 10);
      const result = await HoDModel.create({
        name,
        gender,
        department,
        email,
        phone,
        password: hashPassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      req.flash("success", "HoD registered Successfully");
      return res.redirect("/hod/display");
    } catch (err) {
      console.log(err);
    }
  };

  static HodDelete = async (req, res) => {
    try {
      // console.log(req.params)
      const id = req.params.id;
      // console.log(id)
      const hod = await HoDModel.findById(id);
      const imageID = hod.image.public_id;
      // console.log(id)
      if (hod.image && hod.image.public_id) {
        await cloudinary.uploader.destroy(imageID);
      }
      await HoDModel.findByIdAndDelete(id);
      req.flash("success", "HOD Deleted Successfully");
      return res.redirect("/hod/display");
    } catch (err) {
      console.log(err);
    }
  };

  static HodView = async (req, res) => {
    try {
      const id = req.params.id;
      const view = await HoDModel.findById(id);

      return res.render("hod/view", { view });
    } catch (error) {
      console.log(error);
    }
  };

  static HodEdit = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      const edit = await HoDModel.findById(id);
      return res.render("hod/edit", {
        edit,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static HodUpdate = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, gender, department, email, phone, password, image } =
        req.body;
      if (req.files) {
        // agr image aa rhi hogi toh isme jaayegi vrna nhi jaayegi
        const hod = await HoDModel.findById(id);
        const imageID = hod.image.public_id;
        // console.log(imageID);

        //deleting image from Cloudinary
        if (hod.image && hod.image.public_id) {
          await cloudinary.uploader.destroy(imageID);
        }
        
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "hod_images",
          }
        );

        var data = {
          name,
          gender,
          department,
          email,
          phone,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name,
          gender,
          department,
          email,
          phone,
        };
      }
      await HoDModel.findByIdAndUpdate(id, data);
      req.flash("success", "Profile Updated successfully");
      res.redirect("/hod/display");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = HodController;
