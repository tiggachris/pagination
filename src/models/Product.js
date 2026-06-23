const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  updatedAt: -1,
  _id: -1,
});

productSchema.index({
  category: 1,
  updatedAt: -1,
  _id: -1,
});

productSchema.index({
  name: "text",
  category: "text",
});

module.exports = mongoose.model("Product", productSchema);
