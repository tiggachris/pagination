const express = require("express");

const router = express.Router();

const {
  getProducts,
  renderHome
} = require("../controllers/productControllers.js");

router.get("/", renderHome);

router.get("/api/products", getProducts);

module.exports = router;