require("dotenv").config();

const path = require("path");
const express = require("express");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", productRoutes);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
