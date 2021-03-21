const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const localStorage = require("localStorage");

const bodyParser = require("body-parser");

const controller = require("./controller/allMethods");

const app = express();
app.use(express.json());
const port = process.env.PORT || 7000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// database Connection
mongoose.connect("mongodb://localhost/project2", { useNewUrlParser: true });
mongoose.connection
  .once("open", () => {
    console.log("Connection Created");
  })
  .on("error", (error) => {
    console.log("Connection Fails");
  });

app.get("/", (req, res) => {
  res.status(200).render("login", {
    message: "",
  });
});

app.get("/search", (req, res) => {
  controller.allMember(req, res);
});

app.get("/loginForm", (req, res) => {
  res.status(200).render("login", {
    message: "",
  });
});

app.get("/registrationF", (req, res) => {
  res.status(200).render("registration");
});

app.get("/newPost", (req, res) => {
  if (getLoginID() === "login") {
    res.status(200).render("login", {
      message: "",
    });
  } else {
    res.status(200).render("addArtical");
  }
});

app.get("/searchPost", (req, res) => {
  if (getLoginID() === "login") {
    res.status(200).render("login", {
      message: "",
    });
  } else {
    controller.validateMemeber(req, res);
  }
});

app.get("/blogs", (req, res) => {
  if (getLoginID() === "login") {
    res.status(200).render("login", {
      message: "",
    });
  } else {
    controller.mySaveBlogs(req, res);
  }
});

app.get("/addMember", (req, res) => {
  controller.addNewMember(req, res);
});

app.get("/validateMember", (req, res) => {
  controller.checkMember(req, res);
});
app.get("/delete/:id", (req, res) => {
  console.log(req.params.id);
  controller.removeMyPost(req, res);
});

app.get("/getAllPost", (req, res) => {
  controller.allPost(req, res);
});

app.get("/getsinglePost/:id", (req, res) => {
  controller.getaPost(req, res);
});

app.get("/addPost", (req, res) => {
  controller.newPost(req, res);
});

app.get("/searchByEmail", (req, res) => {
  if (getLoginID() === "login") {
    res.status(200).render("login", {
      message: "",
    });
  } else {
    controller.checkByMail(req, res);
  }
});

app.get("/postComment/:id", (req, res) => {
  controller.addNewComment(req, res);
});

app.get("/addComment", (req, res) => {
  controller.addComment(req, res);
});
app.get("/removeAllPost", (req, res) => {
  controller.removeAllPost(req, res);
});

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
setLoginID("id", "login");
// server
app.listen(port, function () {
  console.log("app is running on port 7000");
});
