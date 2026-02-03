import express from "express"
import sellerAuth from "../middleware/sellerAuth.js";
import { upload } from "../config/multer.js";
import { addProduct, changeStock, productById, productList } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array([images]), sellerAuth, addProduct);
productRouter.get("/list", productList);
productRouter.get("/id", productById);
productRouter.post("/stock", sellerAuth, changeStock);

export default productRouter;