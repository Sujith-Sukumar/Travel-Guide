import express from 'express'
import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import Grid from 'gridfs-stream'
import { GridFsStorage } from 'multer-gridfs-storage'
import { GridFSBucket } from 'mongodb'
import cors from 'cors'
import { File, Cart, auth, Destmodel, Imagemodel, State } from './schema.js'
import Flightbook from './bookingschema.js'
import trainbook from './trainbookingschema.js'
import busbook from './busebookingschema.js'
import cabbook from './cabbooking.js'

const app = express()
app.use(express.json())

const mongoURI = process.env.MONGO_URI;
const conn = mongoose.connection;
const SECRET = process.env.JWT_SECRET;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

const connectToDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/travelguide')
        console.log('database connected');

    } catch (error) {
        console.log('db connection failure', error);

    }
}
connectToDb()

let gfs, gfsBucket;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
    gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads',
        }
    }
})

const upload = multer({ storage });
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File upload failed' })
        }
        console.log(req.file);
        res.status(201).json({ file: req.file });
    } catch (error) {
        res.status(500).json({ error: 'Internel server error' })
    }
});

app.get('/file/:filename', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
        const file = await db.collection('uploads.files').findOne({ filename: req.params.filename });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const range = req.headers.range;
        if (!range) {
            return res.status(416).send('Range header required');
        }

        const videoSize = file.length;
        const CHUNK_SIZE = 1 * 1e6;

        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": file.contentType,
        };

        res.writeHead(206, headers);

        const downloadStream = bucket.openDownloadStream(file._id, {
            start,
            end: end + 1, 
        });

        downloadStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving file', detail: error.message });
    }
});


const imagestorage = multer.memoryStorage();
const imagesupload = multer({ storage: imagestorage })

app.post('/uploadimage', imagesupload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File upload failed' })
        }
        const { qoutesone, qoutestwo, statename, description, heading, airport, railway } = req.body
        const filename = req.file.originalname;
        const newFile = new File({
            qoutesone,
            qoutestwo,
            statename,
            description,
            heading,
            airport,
            railway,
            image: req.file.buffer,
            imageType: req.file.mimetype,
            filename,
        })
        await newFile.save();
        res.status(200).json({ message: "Student added successfully!", filename });
    } catch (error) {
        res.status(500).json({ message: 'failed to upload images' })
    }
})

app.get('/search', async (req, res) => {
    try {
        let image;
        if (req.query.filename) {
            image = await File.find({ filename: new RegExp(req.query.filename, 'i') })
        } else {
            image = await File.find()
        }
        image = image.map((file) => ({
            id: file._id,
            filename: file.filename,
            statename: file.statename,
            heading: file.heading,
            airport: file.airport,
            image: `data:${file.imageType};base64,${file.image.toString('base64')}`,
        }))
        res.status(200).json(image)
    } catch (error) {
        res.status(500).json({ error: 'internel server error' })
    }
})

app.get('/search/attra', async (req, res) => {
    try {
        let image;
        if (req.query.filename) {
            image = await File.find({ filename: new RegExp(req.query.filename, 'i') })
        } else {
            image = await File.find()
        }
        image = image.map((file) => ({
            id: file._id,
            statename: file.statename,
            image: `data:${file.imageType};base64,${file.image.toString('base64')}`,
        }))
        res.status(200).json(image)
    } catch (error) {
        res.status(500).json({ error: 'internel server error' })
    }
})

app.get('/search/:id', async (req, res) => {
    const { id } = req.params
    const item = await File.findById(id)
    if (!item) {
        return res.status(404).json({ message: 'item not found' })
    }
    res.json(item)
})
const statestorage = multer.memoryStorage();
const statessupload = multer({ storage: statestorage })

app.post('/uploadstateimage', statessupload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File upload failed' })
        }
        const {statename } = req.body
        const filename = req.file.originalname;
        const newstate = new State({
            statename,
            image: req.file.buffer,
            imageType: req.file.mimetype,
            filename,
        })
        await newstate.save();
        res.status(200).json({ message: "Student added successfully!", filename });
    } catch (error) {
        res.status(500).json({ message: 'failed to upload images' })
    }
})
app.get('/searchstateimage', async (req, res) => {
    try {
        let image;
        if (req.query.filename) {
            image = await State.find({ filename: new RegExp(req.query.filename, 'i') })
        } else {
            image = await State.find()
        }
        image = image.map((file) => ({
            id: file._id,
            filename: file.filename,
            statename: file.statename,
            image: `data:${file.imageType};base64,${file.image.toString('base64')}`,
        }))
        res.status(200).json(image)
    } catch (error) {
        res.status(500).json({ error: 'internel server error' })
    }
})
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10)
        const user = await auth.create({ username, password: hash })

        const token = jwt.sign({ id: user._id }, SECRET)
        res.json({ message: 'Signup successful', token })
    } catch (error) {
        res.status(500).json({ message: 'sign up is not successful' })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await auth.findOne({ username })
        if (!user) return res.status(404).json({ message: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, SECRET);
        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: 'login is not success' })
    }
})

const cartStorage = multer.memoryStorage();
const cartUpload = multer({ storage: cartStorage });

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Missing token' });
    try {
        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        res.status(403).json({ message: 'Invalid token' });
    }
};

app.post('/bookmark', verifyToken, cartUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File upload failed' });
        }
        const { qoutesone, qoutestwo, statename, description, heading, airport, railway } = req.body;
        const filename = req.file.originalname;

        const cartData = new Cart({
            userId: req.userId,
            qoutesone,
            qoutestwo,
            statename,
            description,
            heading,
            airport,
            railway,
            image: req.file.buffer,
            imageType: req.file.mimetype,
            filename
        });

        await cartData.save();
        res.status(200).json({ message: "Destination bookmarked!", cartData });
    } catch (error) {
        res.status(500).json({ message: 'Cart upload error', error: error.message });
    }
});

app.get('/bookmark/search', verifyToken, async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.userId });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error: error.message });
    }
});

app.get('/cart/search/:id', async (req, res) => {
    try {
        const { id } = req.params
        const item = await Cart.findById(id)
        if (!item) {
            return res.status(404).json({ error: 'item not found' })
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error: error.message });

    }
})
app.get('/bookmark/delete/:id', async (req,res) =>{
try {
    const deleteBookmarked = await Cart.findByIdAndDelete(req.params.id)
    if(!deleteBookmarked){
        return response.status(404).json({ error: 'Bookmarked removed' })
    }
} catch (error) {
    res.status(500).json({message:'error deleting bookmarked data'})
}
})

app.post('/book/flights', verifyToken, async (req, res) => {
    try {
        const booking = await new Flightbook({ ...req.body, userId: req.userId }).save()
        res.status(201).json(booking)
    } catch (error) {
        res.status(500).json({ error: 'internel server error' })
    }
})

app.get('/flight/search', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const bookedflightsearch = await Flightbook.find({ userId })
        res.status(200).json(bookedflightsearch)
    } catch (error) {
        res.status(500).json({ message: 'booked details not get', error: 'Internal server error' })
    }
})

app.delete('/flight/delete/:id', async (req, res) => {
    try {
        const deletingDetails = await Flightbook.findByIdAndDelete(req.params.id);
        if (!deletingDetails) {
            return response.status(404).json({ error: 'Booking canceled' })
        }
    } catch (error) {
        res.status(500).json({ message: 'query deletion not success' })
    }
})

app.post('/book/trains', verifyToken, async (req, res) => {
    try {
        const trainbooking = await new trainbook({ ...req.body, userId: req.userId }).save()
        res.status(201).json(trainbooking)
    } catch (error) {
        res.status(500).json({ error: 'internel server error' })
    }
})
app.get('/train/search', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const bookedtrainsearch = await trainbook.find({ userId })
        res.status(200).json(bookedtrainsearch)
    } catch (error) {
        res.status(500).json({ message: 'booked details not get', error: 'Internal server error' })
    }
})
app.delete('/train/delete/:id', async (req, res) => {
    try {
        const deleteDetails = await trainbook.findByIdAndDelete(req.params.id)
        if (!deleteDetails) {
            return res.status(404).json({ message: 'deleting not success' })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'query deletion not success' })
    }

})
app.post('/book/buses', verifyToken, async (req, res) => {
    try {
        const busbooking = await new busbook({ ...req.body, userId: req.userId }).save()
        res.status(201).json(busbooking)
    } catch (error) {
        res.status(500).json({ error: 'internel server error' })
    }
})
app.get('/bus/search', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const searchedBus = await busbook.find({ userId })
        res.status(200).json(searchedBus)
    } catch (error) {
        res.status(500).json({ message: 'booked details not get', error: 'Internal server error' })
    }
})
app.delete('/bus/delete/:id', async (req, res) => {
    try {
        const deleteBusData = await busbook.findByIdAndDelete(req.params.id)
        if (!deleteBusData) {
            return res.status(404).json({ message: 'deleting not success' })
        }
    } catch (error) {
        res.status(500).json({ message: 'query deletion not success' })
    }
})
app.post('/book/cabs', verifyToken, async (req, res) => {
    try {
        const cabbooking = await new cabbook({ ...req.body, userId: req.userId }).save()
        res.status(201).json(cabbooking)
    } catch (error) {
        res.status(500).json({ error: 'internel server error' })
    }
})
app.get('/cabs/search', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const cabSearch = await cabbook.find({ userId })
        res.status(200).json(cabSearch)
    } catch (error) {
        res.status(500).json({ 'internel server error': error })
    }
})

app.delete('/cab/delete/:id', async (req, res) => {
    try {
        const cabDelete = await cabbook.findByIdAndDelete(req.params.id);
        if (!cabDelete) {
            return res.status(404).json({ message: 'deleting not success' })
        }
    } catch (error) {
        res.status(500).json({ 'internel server error': error })
    }
})

const destsotrage = multer.memoryStorage();
const destupload = multer({ storage: destsotrage })

app.post('/destination/upload', destupload.single('image'), async (req, res) => {
    try {
        const { heading, states } = req.body;
        const destData = new Destmodel({
            heading,
            states,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            }
        });
        await destData.save()
        res.status(200).json({ message: 'Destination uploaded successfully' })
    } catch (error) {
        console.error('Error uploading destination:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

app.get('/destination/get', async (req, res) => {
    try {
        const destinationData = await Destmodel.find();
        const gettingData = destinationData.map(dest => ({
            heading: dest.heading,
            states: dest.states,
            image: `data:${dest.image.contentType};base64,${dest.image.data.toString('base64')}`
        }));
        res.status(200).json(gettingData);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

const bookingStorage = multer.memoryStorage()
const uploadBooking = multer({ storage: bookingStorage })
app.post('/bookingimage/upload', uploadBooking.single('image'), async (req, res) => {
    try {
        const filename = req.file.originalname;
        const bookingImageData = new Imagemodel({
            filename,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            }
        })
        await bookingImageData.save()
        res.status(200).json({ message: ' uploaded successfully' })
    } catch (error) {
        console.error('Error uploading destination:', error);
        res.status(500).json({ message: 'Server error' });
    }
})
app.get('/bookingimage/:filename', async (req, res) => {
    try {
        const file = await Imagemodel.findOne({ filename: req.params.filename })
        if (!file) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.set('Content-Type', file.image.contentType);
        res.send(file.image.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Server error' });
    }
})
const port = process.env.PORT;
app.listen(port, () => {
    console.log('server started');

})

