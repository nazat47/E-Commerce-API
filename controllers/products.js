const { BadRequest, NotFound } = require("../errors");
const Products = require("../models/products");
const Category = require("../models/categories");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileWOExt = file.originalname.split(".");
    const uniqueSuffix = fileWOExt[0].split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${uniqueSuffix}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

const createProduct = async (req, res) => {
  const category = await Category.findById(req.body.categorie);
  if (!category) {
    throw new BadRequest("Invalid category");
  }
  const file = req.file;
  if (!file) {
    throw new BadRequest("Please upload an image");
  }
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const prdcts = await Products.create({
    ...req.body,
    image: `${basePath}${fileName}`,
  });
  res.status(StatusCodes.CREATED).json({ prdcts });
};
const getAllProducts = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) {
    filter = { categorie: category.split(",") };
  }
  const prdcts = await Products.find(filter);
  res.status(StatusCodes.OK).json({ prdcts });
};
const getProductsCount = async (req, res) => {
  const prdcts = await Products.countDocuments();
  res.status(StatusCodes.OK).json({ Total_Products: prdcts });
};
const getFeaturedProducts = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const prdcts = await Products.find({ isFeatured: true }).limit(+count);
  res.status(StatusCodes.OK).json({ prdcts });
};
const getProduct = async (req, res) => {
  const { id } = req.params;
  const prdcts = await Products.findById(id)
    .select(["name", "price", "inStock", "-_id"])
    .populate("categorie");
  if (!prdcts) {
    throw new NotFound(`No product found with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ prdcts });
};
const updateProduct = async (req, res) => {
  const {
    params: { id },
    body: { name, description, categorie, inStock },
  } = req;
  if (name === "" || description === "" || categorie === "" || inStock === "") {
    throw new BadRequest("please insert the required fields");
  }
  const category = await Category.findById(req.body.categorie);
  if (!category) {
    throw new BadRequest("Invalid category");
  }
  const update = await Products.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!update) {
    throw new NotFound(`No product found with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ update });
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const del = await Products.findOneAndDelete({ _id: id });
  if (!del) {
    throw new NotFound(`No product found with id ${id}`);
  }
  res.status(StatusCodes.OK).send("Deleted");
};
const updateProductGallery = async (req, res) => {
  const { id } = req.params;
  let imagePaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const files = req.files;
  if (files) {
    files.map((file) => {
      imagePaths.push(`${basePath}${file.filename}`);
    });
  }
  const updateGallery = await Products.findOneAndUpdate(
    { _id: id },
    {
      images: imagePaths,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updateGallery) {
    throw new NotFound(`No product found with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ updateGallery });
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductsCount,
  updateProduct,
  deleteProduct,
  getProduct,
  getFeaturedProducts,
  uploadOptions,
  updateProductGallery,
};
