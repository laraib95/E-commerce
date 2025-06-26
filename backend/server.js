//This file starts server and connects the DB
const express = require('express');     {/*express for API routes*/}
const cors = require('cors');        //To enable Cross-Origin requests (allow frontend to access backend)
const connectDB = require('./Configure/mongoDB');
require('dotenv').config();             // Load environment variables from .env file
const app = express();

//iporting cloudinary configuration
const configuredCloudinary = require('./Configure/cloudinaryConfig');
console.log('Cloudinary configuration file imported and executed.');


//define routes
const authRoutes = require('./routes/authRoutes');  //uses defined routes
const cartRoutes = require('./routes/cartRoutes');
const ProfileRoutes = require('./routes/ProfileRoutes');
const productRoutes = require('./routes/productRoutes')
const UserRoutes = require('./routes/UserRoutes')

//setting up global Middleware (cors & express.json)
app.use(cors());
app.use(express.json());              //Parse for JSON bodies

//Routes
app.use('/api/v1',authRoutes);          //all routes in authRoutes.js now starts with /api
app.use('/api/v1',cartRoutes);
app.use('/api/v1', ProfileRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1',UserRoutes);

//DB and Server start
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));