const jwt = require("jsonwebtoken");

const checkAuth = (req, res,next) => {
  const token = req.cookies.token;
  //   console.log(token);
  if (!token) {
    req.flash("error", "Unauthorized User, Please Login");
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_secret_key); // Verify if the token is generated with the secret key provided in the second parameter only
    // console.log(decoded); // This will give the decoded object consisting -> id,name,role...
    req.user = decoded; // {id,name,role}
    next() // This will execute the next part of execution
  } catch (err) {
    return res.redirect("/login");
  }
};

module.exports = checkAuth;
