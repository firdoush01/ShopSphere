import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    //validation
    switch (true) {
      case !name:
        return res.status(400).json({ message: "Name is required" });
      case !description:
        return res.status(400).json({ message: "Description is required" });
      case !price:
        return res.status(400).json({ message: "Price is required" });
      case !category:
        return res.status(400).json({ message: "Category is required" });
      case !quantity:
        return res.status(400).json({ message: "Quantity is required" });
      case !brand:
        return res.status(400).json({ message: "Brand is required" });
    }

    const product = await new Product({ ...req.fields }).save();
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    //validation
    switch (true) {
      case !name:
        return res.status(400).json({ message: "Name is required" });
      case !description:
        return res.status(400).json({ message: "Description is required" });
      case !price:
        return res.status(400).json({ message: "Price is required" });
      case !category:
        return res.status(400).json({ message: "Category is required" });
      case !quantity:
        return res.status(400).json({ message: "Quantity is required" });
      case !brand:
        return res.status(400).json({ message: "Brand is required" });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    await product.save();
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);
    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

const fetchProductsById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product){
       return res.json(product);  
    } else {
      return res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).populate("category").limit(12).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export { addProduct, updateProductDetails, removeProduct, fetchProducts, fetchProductsById , fetchAllProducts, createProductReview, fetchTopProducts, fetchNewProducts};