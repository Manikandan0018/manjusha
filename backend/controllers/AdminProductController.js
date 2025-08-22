import Product from '../models/AdminProduct.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Create product (with expectedDelivery)
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, expectedDelivery } = req.body;
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "admin-products",
    });

    fs.unlinkSync(file.tempFilePath);

    const newProduct = new Product({
      name,
      price,
      description,
      image: result.secure_url,
      expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null, // ✅ store expected date
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update product (with expectedDelivery)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, expectedDelivery } = req.body;
    let image;

    if (req.files && req.files.image) {
      const file = req.files.image;
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "admin-products",
      });
      fs.unlinkSync(file.tempFilePath);
      image = result.secure_url;
    }

    const updatedData = {
      name,
      price,
      description,
      expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
    };
    if (image) updatedData.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
