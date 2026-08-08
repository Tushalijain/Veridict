const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const crypto = require("crypto");
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Backend validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: cleanEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword
    });

    // Generate JWT
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

    // Don't send password to frontend
    user.password = undefined;

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user
    });

  } catch (error) {
    console.error("Registration error:", error);

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

const cleanEmail = email.trim().toLowerCase();

const user = await User.findOne({
  email: cleanEmail
});

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

module.exports = {
    register,
    login
};
