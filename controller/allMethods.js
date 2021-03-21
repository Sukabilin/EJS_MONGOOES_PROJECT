const Member = require("../model/Member");
const localStorage = require("localStorage");

const setLoginID = (id, item) => {
  localStorage.setItem(id, "test");
  var existing = localStorage.getItem(id);
  var data = existing ? item : item;
  localStorage.setItem(id, data);
};
const getLoginID = () => {
  var id = localStorage.getItem("id");
  return id;
};

const setSearchedMember = (id, item) => {
  localStorage.setItem(id, "test");
  var existing = localStorage.getItem(id);

  var data = existing ? item : item;
  localStorage.setItem(id, data);
};
const getSearchedMember = () => {
  var id = localStorage.getItem("post");
  return id;
};

const artical = (id, item) => {
  localStorage.setItem(id, "test");
  var existing = localStorage.getItem(id);
  console.log(existing);
  var data = existing ? item : item;
  localStorage.setItem(id, data);
};
const getartical = () => {
  var id = localStorage.getItem("artical");
  return id;
};

exports.addNewMember = async function (req, res) {
  const newMem = JSON.parse(JSON.stringify(req.query));

  try {
    const newMember = await Member.create(newMem);
    res.status(200).render("login", {
      message: "",
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e,
    });
  }
};
exports.allMember = async function (req, res) {
  try {
    var members = await Member.find();
    res.status(201).json({
      status: "success",
      data: {
        member: members,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: "Fail to load data........",
    });
  }
};
const mypost = async (id) => {
  var member = await Member.find({ _id: id });
  if (member[0].blog.length === 0) {
    return [];
  } else {
    return member[0].blog;
  }
};
exports.mySaveBlogs = async function (req, res) {
  try {
    const allPost = await mypost(getLoginID());
    res.status(200).render("myPost", {
      post: allPost,
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e,
    });
  }
};

exports.checkMember = async function (req, res) {
  try {
    var member = await Member.find({ email: req.query.email });
    if (member.length !== 0) {
      if (member[0].password === req.query.password) {
        setLoginID("id", member[0]._id);

        const allPost = await mypost(member[0]._id);
        res.status(200).render("myPost", {
          post: allPost,
        });
      } else {
        res.status(201).render("login", {
          message: "Error in Login ",
        });
      }
    } else {
      res.status(201).render("login", {
        message: "Error in Login ",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e,
    });
  }
};
// get the post by id
exports.getaPost = async function (req, res) {
  try {
    var post = await Member.find({ _id: getLoginID() });
    const blog = post[0].blog;
    const single = blog.filter((el) => el._id == req.params.id);
    res.status(200).render("post", {
      post: single[0],
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: "Fail to load data........",
    });
  }
};
exports.getAllPosts = async function (req, res) {
  try {
    var members = await Member.find({ email: req.params.id });
    const m = members[0].blog;
    res.status(201).json({
      status: "success",
      data: {
        blog: m,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: "Fail to load data........",
    });
  }
};

exports.allPost = async function (req, res) {
  try {
    var members = await Member.find({ email: req.params.id });
    const m = members[0].blog;
    res.status(201).json({
      status: "success",
      data: {
        blog: m,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: "Fail to load data........",
    });
  }
};

exports.newPost = async function (req, res) {
  try {
    const newPost = JSON.parse(JSON.stringify(req.query));
    var members = await Member.findOneAndUpdate(
      { _id: getLoginID() },
      {
        $push: {
          blog: {
            title: newPost.title,
            detial: newPost.detial,
            status: newPost.status,
          },
        },
      },
      { new: true }
    );
    res.status(200).render("myPost", {
      post: members.blog,
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e,
    });
  }
};

const findStatus = (blogs) => {
  const blogStatus = blogs.filter((el) => el.status == "public");
  return blogStatus;
};

exports.checkByMail = async function (req, res) {
  try {
    var newBlogs;
    var member = await Member.find({ email: req.query.email });
    if (member.length === 0) {
      res.status(200).render("search", {
        post: "fix",
        message: "no match Found",
      });
    } else {
      console.log(req.params.id);
      setSearchedMember("post", member[0]._id);
      newBlogs = findStatus(member[0].blog);
      res.status(200).render("search", {
        post: newBlogs,
        message: "",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e,
    });
  }
};

exports.addNewComment = async function (req, res) {
  try {
    artical("artical", req.params.id);
    var post = await Member.find({ _id: getSearchedMember() });
    const blog = post[0].blog;
    const comments = post[0].comments;
    let single = blog.filter((el) => el._id == req.params.id);
    let comm = comments.filter((el) => el._blogId == getartical());

    res.status(200).render("addCommentonPost", {
      post: single[0],
      comment: comm,
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e,
    });
  }
};

exports.addComment = async function (req, res) {
  try {
    const m = await Member.find({ _id: getLoginID() });

    const newPost = JSON.parse(JSON.stringify(req.query));

    var members = await Member.findOneAndUpdate(
      { _id: getSearchedMember() },
      {
        $push: {
          comments: {
            _blogId: getartical(),
            name: m[0].firstName,
            comment: newPost.detial,
          },
        },
      },
      { new: true }
    );
    const c = members.comments;

    const artical = getartical();
    var post = await Member.find({ _id: getSearchedMember() });
    const blog = post[0].blog;
    const comments = post[0].comments;
    let single = blog.filter((el) => el._id == artical);
    let comm = comments.filter((el) => el._blogId == getartical());

    res.status(200).render("addCommentonPost", {
      post: single[0],
      comment: comm,
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e,
    });
  }
};

exports.removeMyPost = async function (req, res) {
  try {
    var members = await Member.update(
      { _id: getLoginID() },
      {
        $pull: {
          blog: {
            _id: req.params.id,
          },
        },
      }
    );

    const m = await Member.find({ _id: getLoginID() });
    const allPost = m[0].blog;

    res.status(200).render("myPost", {
      post: allPost,
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e,
    });
  }
};

exports.removeAllPost = async function (req, res) {
  try {
    var members = await Member.update(
      { _id: getLoginID() },
      {
        $set: { blog: [] },
      }
    );

    res.status(200).render("myPost", {
      post: [],
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e,
    });
  }
};
