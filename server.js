const express = require("express")
const session = require("express-session")
const ejs = require("ejs")
const path = require("path")
const { v4: uuid } = require("uuid")
const connectDB = require("./server/dataBase/connection")
const nocache = require("nocache")
const app = express()
require("dotenv").config();

connectDB()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB Connection error: ", err));
app.set("view engine", 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(nocache())

app.use("/img", express.static(path.join(__dirname, "assets/img")))
app.use("/css",express.static(path.join(__dirname, "assets/css")))
app.use("/fonts",express.static(path.join(__dirname, "assets/fonts")))
app.use("/uploads",express.static(path.join(__dirname, "assets/uploads")))
app.use("/js",express.static(path.join(__dirname, "assets/js")))
app.use(express.static(__dirname + "/assets/css"));
const aa = path.join(__dirname, "assets/css")


app.use(
    session({
      secret: uuid(),
      resave: false,
      saveUninitialized: true,
    })
  );
app.set('views', path.join(__dirname, 'views'));
const message = true

app.use('/', require("./server/router/adminRouter"))
app.use('/', require("./server/router/userRouter"))

//app.listen(process.env.PORT)
app.listen(process.env.PORT, (() => console.log(`server started at  http://localhost:${process.env.PORT}`)))