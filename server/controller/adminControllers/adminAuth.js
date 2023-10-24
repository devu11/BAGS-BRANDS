require("dotenv").config();

/////////////////////////////// ADMIN LOGIN PAGE RENDER ////////////////////////////////////////////////////////////////
exports.adminLoginGet = (req, res) => {
  res.render("admin_login");
};

//////////////////////////////// ADMIN LOGIN AUTH //////////////////////////////////////////////////////////////////////

exports.adminLoginPost = (req, res) => {
  if (
    req.body.email == process.env.ADMINEMAIL &&
    req.body.password == process.env.ADMINPASSWORD
  ) {
    req.session.adminEmail = req.body.email;
    res.redirect("/admin");
  } else {
    res.render("admin_login",{message:true});
  }
};

exports.adminLogoutGet = (req, res) => {
  delete req.session.adminEmail;
  res.redirect("/admin_login");
};
