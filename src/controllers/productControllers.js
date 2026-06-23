const Product = require("../models/Product");

const DEFAULT_LIMIT = 20;
const LIMIT_OPTIONS = [20, 40, 60,80,100];

const getLimit = (value) => {
  const parsed = parseInt(value, 10);

  return LIMIT_OPTIONS.includes(parsed) ? parsed : DEFAULT_LIMIT;
};

const getPage = (value) => {
  const parsed = parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildProductQuery = (search) => {
  const trimmedSearch = search.trim();

  if (!trimmedSearch) {
    return {};
  }

  const regex = new RegExp(escapeRegex(trimmedSearch), "i");
  const conditions = [
    { name: regex },
    { category: regex },
  ];

  const numericSearch = Number(trimmedSearch);

  if (!Number.isNaN(numericSearch)) {
    conditions.push({ price: numericSearch }, { stock: numericSearch });
  }

  return {
    $or: conditions,
  };
};

const findProductsPage = async ({ page, limit, search }) => {
  const query = buildProductQuery(search);
  const totalDocs = await Product.countDocuments(query);
  const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
  const currentPage = Math.min(page, totalPages);
  const skip = (currentPage - 1) * limit;

  const products = await Product.find(query)
    .sort({
      updatedAt: -1,
      _id: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    products,
    totalDocs,
    totalPages,
    currentPage,
    limit,
    search,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
};

exports.renderHome = async (req, res) => {
  try {
    const page = getPage(req.query.page);
    const limit = getLimit(req.query.limit);
    const search = req.query.search || "";
    const pagination = await findProductsPage({ page, limit, search });

    res.render("index", pagination);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const page = getPage(req.query.page);
    const limit = getLimit(req.query.limit);
    const search = req.query.search || "";
    const pagination = await findProductsPage({ page, limit, search });

    res.json({
      success: true,
      count: pagination.products.length,
      ...pagination,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.seedProducts = async (req, res) => {
  try {
    const countSource = req.body?.count || req.query?.count;
    const num = Number.parseInt(countSource, 10) || 200;

    // require faker here so the server doesn't need it unless this route is used
    const { faker } = require("@faker-js/faker");

    const products = [];

    for (let i = 0; i < num; i++) {
      products.push({
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: Number(faker.commerce.price()),
        stock: faker.number.int({ min: 1, max: 500 }),
        updatedAt: new Date(),
      });
    }

    const inserted = await Product.insertMany(products);

    res.json({ success: true, inserted: Array.isArray(inserted) ? inserted.length : 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
