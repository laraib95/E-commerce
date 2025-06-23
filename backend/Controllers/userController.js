const User = require('../models/User');        // import User model
const bcrypt = require('bcryptjs');

//get the profile of logged-in user
exports.viewUserProfile = async (req, res) => {
    try {
        //req.user.id comes from the verifyToken middleware
        //(User.findById(req.user.id) : will find the user by user_id in db)
        //select(-password): - is a mongoose projection operator. it means to exclude that field
        const user = await User.findById(req.user.id).select('-password'); //-password to exclude password hash
        if (!user) { return res.status(400).json({ message: "User not Found" }) };
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile", error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { name, email, password, mobilenumber, age } = req.body;
    const userId = req.user.id;             //User ID from authenticated token
    try {
        const user = await User.findById(userId);
        if (!user) { return res.status(401).json({ message: 'User not found' }) }
        user.name = name || user.name
        user.mobilenumber = mobilenumber || user.mobilenumber;
        user.age = age || user.age;

        //handling email updation
        //check if email is provided and different
        if (email && email !== user.email) {
            //now check if updated email is already existing
            const emailmatch = await User.findOne({ email })
            if (emailmatch && emailmatch._id.toString() !== userId) { return res.status(400).json({ message: 'Email already registered' }) }
            user.email = email;
        }
        //handle password update if a new updated password is provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        await user.save();

         const updatedUser = await User.findById(userId).select('-password');
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Error Updating User Profile",error)
        res.status(500).json({message : "Server Error"});
    }
};