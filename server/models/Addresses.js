import mongoose from "mongoose"

// Creating user schema
const AddressSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: Number, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
});


// .model gets collection name & schema
const AddressModel = mongoose.models.address || mongoose.model("address", AddressSchema);


// Exporting the model
export default AddressModel;