const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// require("../config/firebaseAdmin");
// const { getAuth } = require("firebase-admin/auth");
const crypto = require("crypto");
const register = async (req,res)=> {
    try{
       const{name,email,password} = req.body;
       if (!name || !email || !password ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
    name,
    email,
    password: hashedPassword,
    provider: "google"
});

        user.password = undefined;

        return res.status(201).json({
            message: "User registered successfully",
            user
        });

    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

            const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

        user.password = undefined;

        return res.status(200).json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const googleLogin = async (req, res) => {
    try {

        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                message: "ID Token is required"
            });
        }

        const decodedToken = await getAuth().verifyIdToken(idToken);

        const { email, name } = decodedToken;

        let user = await User.findOne({ email });

        if (!user) {

            const randomPassword =
                crypto.randomBytes(32).toString("hex");

            const hashedPassword =
                await bcrypt.hash(randomPassword, 10);

            user = await User.create({
                name,
                email,
                password: hashedPassword
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        user.password = undefined;

        return res.status(200).json({
            message: "Google Login Successful",
            token,
            user
        });

    }
    catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    register,
    login
};
