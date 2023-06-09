const user = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../Middlewares/sendEmail");

module.exports.userSignUpController = async (req, res) => {
  try {
    const data = req.body;
    const isExist = await user.findOne({ email: data.email });
    console.log(isExist);
    if (isExist) {
      res.status(200).json({
        status: false,
        message: "This user is already exists!",
      });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(data.password, salt, async function (err, hash) {
          data.password = hash;
          const result = await user.create({
            ...data,
          });
          const token = jwt.sign(
            { email: result._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
          );
          res.status(200).json({
            status: true,
            message: "Successfully created the user",
            result: result,
            token: token,
          });
        });
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

//signin
module.exports.signInController = async (req, res) => {
  try {
    const { password, email } = req.body;
    const result = await user.findOne({ email: email });
    if (result) {
      bcrypt.compare(password, result.password, function (err, response) {
        if (err) {
          res.status(200).json({
            status: false,
            message: err.message,
          });
        }
        if (response) {
          const token = jwt.sign(
            { email: result._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
          );
          res.status(200).json({
            status: true,
            message: "login successful",
            result: result,
            token: token,
          });
        } else {
          // response is OutgoingMessage object that server response http request
          res.json({
            success: false,
            message: "passwords do not match",
          });
        }
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Invalid Email",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.autoLoginController = async (req, res) => {
  try {
    const token = req.body.token;
    let id;
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: "Forbidden access" });
      }
      req.decoded = decoded;
      // console.log(decoded);
      if (decoded.email) {
        const result = await user.findById(decoded.email).select("-password");
        // console.log(result)
        if (result) {
          res.status(200).json({
            message: "Found User",
            result: result,
            status: true,
          });
        } else {
          res.status(200).json({
            message: "Failed to get User",
            status: false,
          });
        }
      } else {
        res.status(200).json({
          message: "Failed to get User",
          status: false,
        });
      }
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.getUserInfoById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await user.findById(id);
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "UserInfo fetched successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to get User Info!",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.updateUserInfoById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await user.findByIdAndUpdate(
      id,
      { $inc: { reputation: 1 } },
      { new: true, upsert: true }
    );
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "User updated successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to update User",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.getVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    function generateSixDigitCode() {
      // Generate a random number between 0 and 999999 (inclusive)
      var randomNumber = Math.floor(Math.random() * 1000000);

      // Pad the number with leading zeros to ensure it has 6 digits
      var sixDigitCode = randomNumber.toString().padStart(6, "0");

      return sixDigitCode;
    }

    // Example usage
    var code = generateSixDigitCode();
    const subject = "Password Reset Code of Abroad Help";
    const text = `Your Code is: ${code}`;
    const result = await user.findOneAndUpdate(
      { email: email },
      { passwordReset: code }
    );
    if (result) {
      sendEmail(email, text, subject);
      res.status(200).json({
        status: true,
        result: result.email,
        message: "Password reset email sent successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to send code",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const isExist = await user.findOne({ email: email });
    if (isExist?.passwordReset === code) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newPassword, salt, async function (err, hash) {
          const result = await user.findOneAndUpdate(
            { email: email },
            { password: hash }
          );
          if (result) {
            res.status(200).json({
              status: true,
              result: result.email,
              message: "Password was reset successfully!",
            });
          } else {
            res.status(200).json({
              status: false,
              message: "Failed to reset password",
            });
          }
        });
      });
    }else {
      res.status(200).json({
        status: false,
        message: "Failed to reset password",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};
