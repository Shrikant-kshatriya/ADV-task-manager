const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerUser, loginUser } = require("../services/authServices");

const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    // Create new user
    const newUser = registerUser(username, email, password, role);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loggeduser = await loginUser(email, password);
    if (!loggeduser.success) {
      return res.status(400).json({ message: loggeduser.message });
    }
    const token = jwt.sign({ id: loggeduser.user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
    req.session.token = token;
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'None' });
    res.status(200).json({ message: "Login successful", user: { username: loggeduser.user.username, _id: loggeduser.user._id, email: loggeduser.user.email, role: loggeduser.user.role}});

    } catch (error) {
    res.status(500).json({ message: "Server error" }); 
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Failed to destroy session" });
      }
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  register,
  login,
  logout
};
