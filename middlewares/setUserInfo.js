const jwt = require("jsonwebtoken");

const setUserInfo = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.jwt_secret_key);
      req.user = decoded; // so you can still use req.user
      // console.log(decoded)
      res.locals.id = decoded.id;   // in this local means that in all the ejs files , for here as name is written so name will be passed to all the ejs files
      res.locals.name = decoded.name;   // in this local means that in all the ejs files , for here as name is written so name will be passed to all the ejs files
      res.locals.role = decoded.role;
      // res.locals.image = decoded.image;
    } catch (err) {
      res.locals.name = null;
      res.locals.role = null;
    }
  } else {
    res.locals.name = null;
    res.locals.role = null;
  }
  next();
};

module.exports = setUserInfo;
