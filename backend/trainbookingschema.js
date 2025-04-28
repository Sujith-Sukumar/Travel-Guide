import mongoose from "mongoose";

const trainbookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transportationDetails: {
        departure: String,
        arrival: String,
        from: String,
        to: String,
        price: String,
        name: String
    },
    persondetails: {
        name: String,
        number: String
    },
    bookedDetails: {
        arrival: String,
        departure: String,
        departureDate: String,
        name: String
    }

})
const trainbook = mongoose.model('trainbook', trainbookingSchema)
export default trainbook