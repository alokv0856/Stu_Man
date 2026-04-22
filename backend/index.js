require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= MODEL =================
const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  course: String,
});

const Student = mongoose.model("Student", studentSchema);

// ================= MIDDLEWARE =================
const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// ================= ROUTES =================

// REGISTER
app.post("/api/register", async (req, res) => {
  const { name, email, password, course } = req.body;

  try {
    let user = await Student.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    user = new Student({ name, email, password: hashed, course });
    await user.save();

    res.json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, user });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE PASSWORD
app.put("/api/update-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Student.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated" });
  } catch {
    res.status(500).json({ msg: "Error updating password" });
  }
});

// UPDATE COURSE
app.put("/api/update-course", auth, async (req, res) => {
  const { course } = req.body;

  try {
    const user = await Student.findById(req.user.id);
    user.course = course;
    await user.save();

    res.json({ msg: "Course updated" });
  } catch {
    res.status(500).json({ msg: "Error updating course" });
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Student Auth API Running...");
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});