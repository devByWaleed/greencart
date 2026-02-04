import { v2 as cloudinary } from "cloudinary"
import ProductModel from "../models/Products.js"

// Add product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        // Product data
        let productData = JSON.parse(req.body.productData);

        // Images
        const images = req.files;

        // Get multiple images URLs
        let imagesURL = await Promise.all(
            images.map(async (image) => {
                let result = await cloudinary.uploader.upload(image.path, { resource_type: "image" })
                return result.secure_url
            })
        );

        const product = new ProductModel({ ...productData, image: imagesURL });
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Get product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Get individual product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body;

        const product = await ProductModel.findById(id);

        res.json({ success: true, product });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Change product inStock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;

        await ProductModel.findByIdAndUpdate(id, { inStock });

        res.json({ success: true, message: "Stock Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}