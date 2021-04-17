const express = require("express");
const app = express();
const port = process.env.Port || 8080;
let username = "john123";

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index", { username }));

app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
});
