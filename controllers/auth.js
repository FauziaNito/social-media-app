import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER*/
export const register = async (res, req) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Generate a salt using bcrypt
    const salt = await bcrypt.genSalt();

    // Hash the password using the generated salt
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user object with hashed password and other information
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (err) {
    res.stauts(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database by email
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate a JSON Web Token (JWT) with user ID and secret key
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Remove the password from the user object to avoid sending it in the response
    delete user.password;

    // Respond with the token and the user object
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
