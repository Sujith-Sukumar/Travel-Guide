import mongoose from "mongoose";

const fileschema = new mongoose.Schema({
    qoutesone: String,
    qoutestwo: String,
    statename: String,
    description: String,
    heading: String,
    airport: String,
    railway: String,
    image: Buffer, 
    imageType: String,
    filename:String
})
const File = mongoose.model("File", fileschema)

const stateschema = new mongoose.Schema({
    statename: String,
    image: Buffer, 
    imageType: String,
    filename:String
})
const State = mongoose.model("State",stateschema)

const cartSchema = new mongoose.Schema({
    userId:String,
    qoutesone: String,
    qoutestwo: String,
    statename: String,
    description: String,
    heading: String,
    airport: String,
    railway: String,
    image: Buffer, 
    imageType: String,
    filename:String
})
const Cart = mongoose.model("Cart",cartSchema)

const authSchema = new mongoose.Schema({
    username:String,
    password:String
})
const auth = mongoose.model("auth",authSchema)

const destinationSchema = new mongoose.Schema({
    heading:String,
    states:String,
    image:{
        data:Buffer,
        contentType:String,
    }
})
const Destmodel = mongoose.model('Destmodel',destinationSchema)

const bookingimgSchema = new mongoose.Schema({
    filename:String,
    image:{
        data:Buffer,
        contentType:String
    }
})
const Imagemodel = mongoose.model('Imagemodel',bookingimgSchema)

export { File, Cart, auth, Destmodel, Imagemodel, State };
