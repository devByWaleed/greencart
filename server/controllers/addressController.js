import AddressModel from "../models/Addresses.js";

// Add address logout : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address, userID } = req.body;
        await AddressModel.create({ ...address, userID })
        
        return res.json({ success: true, message: "Address added successfully" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}


// Add address logout : /api/address/get
export const getAddress = async (req, res) => {
    try {
        const { userID } = req.body;
        const addresses = await AddressModel.find({ userID })
        
        return res.json({ success: true, addresses })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}