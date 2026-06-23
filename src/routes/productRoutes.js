const express = require("express");

const router = express.Router();

const {
  getProducts,
  renderHome
} = require("../controllers/productControllers.js");
const { seedProducts } = require("../controllers/productControllers.js");

router.get("/", renderHome);

router.get("/api/products", getProducts);

router.post("/seed", seedProducts);

module.exports = router;