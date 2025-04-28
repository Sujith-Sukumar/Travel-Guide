import mongoose from "mongoose";

const bookingschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookedDetails: {
        from: String,
        to: String,
        date: String,
        travalerescount: String,
        economy: String,
        fare: String
    },
    flightDetails: {
        name: String,
        departure: String,
        arrival: String,
        from: String,
        to: String,
        price: String
    },
    personDetails: {
        name: String,
        dob: String,
        number: String
    }
})
const Flightbook = mongoose.model('Flightbook', bookingschema)
export default Flightbook;