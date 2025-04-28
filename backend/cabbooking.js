import mongoose from "mongoose";

const cabbookingschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookedData: {
        pickupplace: String,
        dropplace: String,
        pickupDate: String,
        pickuptime: String,
    },
    cabprice: Number
})
const cabbook = mongoose.model('cabbook', cabbookingschema)
export default cabbook;