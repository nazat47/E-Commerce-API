const { NotFound, BadRequest } = require("../errors/index");
const Categorie = require("../models/categories");
const { StatusCodes } = require("http-status-codes");

const getAllCategories = async (req, res) => {
  const categories = await Categorie.find({});
  res.status(StatusCodes.OK).json({ categories });
};
const getCategory = async (req, res) => {
  const { id } = req.params;
  const categories = await Categorie.findById({ _id: id });
  if (!categories) {
    throw new NotFound(`No category found with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ categories });
};
const createCategory = async (req, res) => {
  const categories = await Categorie.create(req.body);
  res.status(StatusCodes.CREATED).json({ categories });
};
const updateCategory = async (req, res) => {
  const {
    params: { id },
    body:{name}
  } = req;
  if(name===""){
    throw new BadRequest("Please insert category name")
  }
  const category = await Categorie.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new NotFound(`No category found with id ${id}`);
  }
  // await category.remove()
  res.status(StatusCodes.OK).json({ category });
};
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Categorie.findOneAndDelete({ _id: id });
  if (!category) {
    throw new NotFound(`No category found with id ${id}`);
  }
  // await category.remove()
  res.status(StatusCodes.OK).send("Category deleted");
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
};
