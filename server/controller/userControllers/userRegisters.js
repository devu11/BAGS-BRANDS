const User = require("../../model/users");
const nodemailer = require("nodemailer");
let otpMap = new Map();

exports.signinGet = (req, res) => {
  if (req.session.userData) {
    delete req.session.userData;
    return res.render("register", { loggedIn: false });
  }
  res.render("register", { loggedIn: false });
};

exports.siginPost = async (req, res) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charLength = characters.length;
  let referralCode = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * charLength);
    referralCode += characters[randomIndex];
  }
  const data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNo: req.body.phoneNo,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    referralCode: referralCode,
    isBlocked: false,
  };
  const referral = req.body.referral;
  const user = await User.findOne({referralCode: referral});

  if(user){
    req.session.referral = referral;
  }

  const valid = await validation(req.body);

  if (valid.isValid) {
    req.session.userData = data;
    const otpGenerator = () => {
      const otp = Math.floor(100000 + Math.random() * 900000);
      return otp.toString();
    };

    const otp = otpGenerator();
    otpMap.set(data.email, otp);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD,
      },
    });

    const mailOptions = {
      from: "devudevzz3@gmail.com",
      to: data.email,
      subject: "BAGS & BRANDS OTP verification",
      text: `The OTP for your verification is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error occurred:", error);
        res.render("register", { loggedIn: false });
      } else {
        console.log("Email sent successfully:", info.response);
        return res.status(200).end();
      }
    });
  } else if (!valid.isValid) {
    return res.status(400).json({ error: valid.errors });
  }
};


exports.userOtpGet = (req, res) => {
  // Set the OTP timer duration in seconds (e.g., 300 seconds = 5 minutes)
  const otpTimerDuration = 300;
  req.session.otpExpiration = Date.now() + otpTimerDuration * 1000;

  res.render("user_otp", { loggedIn: true, cartItemsCount: "" });
};

exports.registerOtpGet = (req, res) => {
  // Set the OTP timer duration in seconds (e.g., 300 seconds = 5 minutes)
  const otpTimerDuration = 300;
  req.session.otpExpiration = Date.now() + otpTimerDuration * 1000;

  res.render("registerOtp", { loggedIn: false });
};
exports.userotpPost = async (req, res) => {
  const data = req.session.userData;
  const storedOtp = otpMap.get(data.email);

  if (data && data.email) {
    // Check if OTP timer has expired
    if (req.session.otpExpiration && Date.now() > req.session.otpExpiration) {
      res.render("user_otp", {
        loggedIn: false,
        otpExpired: true, // Add a flag to indicate OTP expiration
      });
      return;
    }

    // Rest of your code here
  } else {
    // Handle the case where data is undefined or doesn't have an email property
  }

  if (req.body.otp == storedOtp) {
    // OTP is correct, continue with user creation and redirection
    if (req.session.referral) {
      const referedUser = await User.findOne({ referralCode: req.session.referral });
      if (referedUser) {
        referedUser.wallet.balance += 250;
        await referedUser.save();
      }
      const newUser = await User.create(data);
      if (referedUser) {
        newUser.wallet.balance += 100;
        await newUser.save();
      }
      delete req.session.referral;
      // ... (rest of your code)
    } else {
      const newUser = await User.create(data);
      await newUser.save();
    }
    // ... (rest of your code)

    delete req.session.userData;
    delete req.session.otpExpiration; // Remove the OTP expiration

    res.redirect("/login");
  } else {
    res.render("user_otp", { loggedIn: false, otpExpired: false });
  }
};



async function validation(data) {
  const { firstName, lastName, phoneNo, email, password, confirmPassword } =
    data;
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  const existingUser = await User.findOne({ email: email ,phoneNo:phoneNo});

  if (!email) {
    errors.emailError = "Please Enter an Email";
  } else if (!emailRegex.test(email)) {
    errors.emailError = "please provide an valid Email";
  } else if (existingUser && email == existingUser.email) {
    errors.emailError = "This email is already registered";
  }

  if (!firstName) {
    errors.firstNameError = "Please Enter an Firstname";
  } else if (firstName.includes(" ")) {
    errors.firstNameError = "Invalid spacing between names";
  }

  if (!lastName) {
    errors.lastNameError = "Please Enter an Lastname";
  } else if (lastName.includes(" ")) {
    errors.lastNameError = "Invalid spacing between names";
  }

  if (!phoneNo) {
    errors.phoneNoError = "Please provide a Phone number";
  } else if (!phoneRegex.test(phoneNo)) {
    errors.phoneNoError = "Invalid Phone Number";
  }else if(existingUser && phoneNo == existingUser.phoneNo){
    errors.phoneNoError = "This phoneNo is already registered";
  }



  function isStrongPassword(password) {
    // Define your password criteria here
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;
  
    return (
      password.length >= minLength &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      digitRegex.test(password) &&
      specialCharRegex.test(password)
    );
  }

  if (!password) {
    errors.passwordError = "Please provide a Password";
  } else if (password.length < 8) {
    errors.passwordError = "Password length should be atleast 8";
  }

  if (password != confirmPassword && password.length > 0) {
    errors.confirmPasswordError = "The password do not match";
  }else if(!isStrongPassword(password)){
    errors.passwordError = "Password should be strong with at least one uppercase letter, one lowercase letter, one digit, and one special character.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
