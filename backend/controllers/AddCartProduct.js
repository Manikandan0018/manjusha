import Product from '../models/AddCart.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log("🔍 Incoming cart product data:", req.body); // ✅ log this

    const { name, price, description, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added to cart", product: newProduct });

  } catch (err) {
    console.error("❌ Error creating product:", err); // ✅ log server error
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
