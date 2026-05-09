const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  try {
    // const { fullName, email, mobile, password } = req.body
    //   const hashedPassword = await bcrypt.hash(password, 12);
    await UserModel.create(req.body);
    res.status(200).json({ message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const isLogin = await bcrypt.compareSync(password, user.password);

    if (!isLogin)
      return res.status(401).json({ message: "Incorrect password" });
    const payload = {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      mobile: user.mobile,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Sign in successfull",
      token: token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signup,
  login,
};
