const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ErrorHandler = require("../utils/errorHandler");


//create newUser => '/api/admin/users/new
exports.createUserByAdmin = catchAsyncErrors(async(req,res,next)=> {
    console.log("DEBUG: Entered createUserByAdmin function");
    const {name,email,mobilenumber,age,password,role} = req.body;
    console.log("DEBUG: Request Body for create:", req.body);

    if(!name || !password || !email)
    {
        console.log("DEBUG: Required fields for creating account");
        return next(new ErrorHandler("Fields are required",400))
    }
    const userExists = await User.findOne({email});
    if(userExists) {
        console.log("DEBUG: Email already exists for create")
        return next(new ErrorHandler("Email has taken already",400))
    }
    console.log("DEBUG: Attempting to create user ....");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        age,
        mobilenumber,
        role,
    });
    console.log("DEBUG: new user created successfuly: ", newUser);

    res.status(201).json({
        success: true,
        message:"User Created successfully",
        user:{
            _id : newUser._id,
            name: newUser.name,
            email : newUser.email,
            mobilenumber : newUser.mobilenumber,
            age : newUser.age,
            role : newUser.role,
            created_at : newUser.createdAt, 
        },
    });
    console.log("DEBUG: createdUserByAdmin response sent.");
});


//Get all Users => '/api/admin/Users
exports.getAllUsers = catchAsyncErrors(async(req,res,next) => {
    const users = await User.find().select('-password');

    res.status(200).json({
        success: true,
        users,
    })
})

//Get single user by id => '/api/admin/users/:id
exports.getSingleUser = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json({
        success: true,
        user,
    });
});

//update the user => '/api/admin/users/:id
exports.updateUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,age,mobilenumber} = req.body;
    let user = await User.findById(req.params.id);
    if(!user)
    { return next(new ErrorHandler(`User not found with this id : ${req.params.id}`,400))}
    user.name = name !== undefined ? name : user.name;
    user.email = email !== undefined ? email : user.email;
    user.mobilenumber = mobilenumber !== undefined ? mobilenumber : user.mobilenumber;
    user.age = age !== undefined ? age : user.age;

    const updatedUser = await user.save();
    res.status(200).json({
        success:true,
        user: {
             _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        },
    });
});

//delet the user => '/api/admin/user/delet/:_id
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
        // 1. Find the user by ID from request parameters
    const user = await User.findById(req.params.id);

        // 2. Handle if user is not found
    if(!user)
    { return next(new ErrorHandler(`User not found with id: ${req.params.id}`,400))}
    
        // 3. Delete the user
    await User.deleteOne();

        // 4. Send success response
    res.status(200).json({
        success: true,
        message : "User deleted successfully.",
    });
});

