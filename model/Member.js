const mongoose = require("mongoose");
const Member = new mongoose.Schema({
  firstName: {
    type: "String",
    required: true,
    trim: true,
  },
  lastName: {
    type: "String",
    required: true,
    trim: true,
  },
  email: {
    type: "String",
    required: true,
    trim: true,
  },
  password: {
    type: "String",
    required: true,
  },
  nickName: {
    type: "String",
    trim: true,
  },
  day: {
    type: "String",
    trim: true,
  },
  month: {
    type: "String",
    trim: true,
  },
  blog: [{ title: "String", detial: "String", status: "String" }],
  comments: [{ _blogId: "String", name: "String", comment: "String" }],
});
module.exports = mongoose.model("Member", Member);
// member id save to local spac
// commnet
// post id
