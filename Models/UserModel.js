const { default: mongoose } = require("mongoose");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    likes: {
      type: [],
      default: [],
    },
    comments: {
      type: [],
      default: [],
    },
    profileImg: {
      type: String,
      default: "",
    },
    major:{
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    reputation:{
      type: 0,
      default: 0,
    },
    passwordReset: {
      type: String
    }
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
