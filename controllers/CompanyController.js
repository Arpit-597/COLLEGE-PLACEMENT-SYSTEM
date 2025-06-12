const CompanyModel = require("../models/company");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");

//setup
cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

class CompanyController {
  static display = async (req, res) => {
    try {
      const Company = await CompanyModel.find().sort({ _id: -1 });
      // console.log(Company)
      res.render("company/display", {
        error: req.flash("error"),
        success: req.flash("success"),
        std: Company,
      }); //folder(compnay) -> file(display.ejs)
    } catch (error) {
      console.log(error);
    }
  };

  static insertCompany = async (req, res) => {
    try {
      // console.log(req.body)
      // console.log(req.files.image)
      const { name, address, website, email, phone, password, image } =
        req.body;
      const exisitingCompany = await CompanyModel.findOne({ email });
      if (exisitingCompany) {
        req.flash("error", "Company already Exists");
        return res.redirect("/company/display");
      }

      //image upload
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "company_images",
      });
      // console.log(imageUpload);

      const hashPassword = await bcrypt.hash(password, 10);
      const result = await CompanyModel.create({
        name,
        address,
        website,
        email,
        phone,
        password: hashPassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      req.flash("success", "Company registered Successfully");
      return res.redirect("/company/display");
    } catch (err) {
      console.log(err);
    }
  };

  static CompanyDelete = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      const company = await CompanyModel.findById(id);
      const imageID = company.image.public_id;
      // console.log(id)
      if (company.image && company.image.public_id) {
        await cloudinary.uploader.destroy(imageID);
      }
      await CompanyModel.findByIdAndDelete(id);
      req.flash("success", "Company Deleted Successfully");
      return res.redirect("/company/display");
    } catch (err) {
      console.log(err);
    }
  };

  static CompanyView = async (req, res) => {
    try {
      const id = req.params.id;
      const view = await CompanyModel.findById(id);

      return res.render("company/view", { view });
    } catch (error) {
      console.log(error);
    }
  };

  static CompanyEdit = async (req, res) => {
    try {
      const id = req.params.id;
      const edit = await CompanyModel.findById(id);

      return res.render("company/edit", { edit });
    } catch (error) {
      console.log(error);
    }
  };

  static CompanyUpdate = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, phone, address, website } = req.body;

      // console.log(req.body)

      if (req.files) {
        const company = await CompanyModel.findById(id);
        const imageID = company.image.public_id;
        // console.log(imageID)

        if (company.image && company.image.public_id) {
          await cloudinary.uploader.destroy(imageID);
        }

        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "company_images",
          }
        );
        var data = {
          name,
          email,
          phone,
          address,
          website,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.url,
          },
        };
      } else {
        // console.log(req.files)
        var data = {
          name,
          email,
          phone,
          address,
          website,
        };
      }
      await CompanyModel.findByIdAndUpdate(id, data);
      req.flash("success", "Profile Updated Successfully");
      res.redirect("/company/display");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = CompanyController;
