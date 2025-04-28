import mongoose from "mongoose";

const busbookingschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookedData: {
        origin: String,
        destination: String,
        origindate: String,
        origintime: String,
        seats: String,
    },
    price: Number

})
const busbook = mongoose.model('busbook', busbookingschema)
export default busbook;