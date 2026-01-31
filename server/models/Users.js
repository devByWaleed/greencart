import mongoose from "mongoose"

// Creating user schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItems: { type: Object, default: {} },
}, {minimize: false})


// .model gets collection name & schema
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema)


// Exporting the model
export default UserModel