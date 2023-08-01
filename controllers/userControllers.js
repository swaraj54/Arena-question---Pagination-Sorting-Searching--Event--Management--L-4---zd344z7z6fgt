const users = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Registering user into database
const registerUser = async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    if (password === cpassword) {
      const newUser = new users({
        name: req.body.name,
        password: hashedPass,
        email: req.body.email,
        confirmpassword: req.body.confirmpassword,
      });
      const user = await newUser.save();

      // console.log(user.name);

      //Generating JWT Token using jwt.sign
      const token = jwt.sign({ _id: users._id }, process.env.JWT_SECRET);
      // res.status(200).json(user);
      res.status(200).json(token);
    } else {
      res.status(404).send('Incorrect Data');
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

//Checking if the user exists
const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await users.findOne({
      email: email,
    });

    //comparing our hash with password

    const isMatch = await bcrypt.compare(password, useremail.password);
    const token = jwt.sign({ _id: users._id }, process.env.JWT_SECRET);
    console.log({ _id: users._id });
    // res.status(200).json(token);
    if (isMatch) {
      res.send('Successful Login' + token);
    } else {
      res.send('Error Details Incorrect');
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    const user = await users.findById(req.params.id);

    if (user.email === req.body.email) {
      try {
        await user.delete();
        res.status(201).json('User Deleted');
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(500).send('Error deleting User');
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

//Updating Password
const updatePasword = async (req, res) => {
  try {
    const User = await users.findById(req.params.id);
    if (User.email === req.body.email) {
      try {
        const updatedPassword = await users.findByIdAndUpdate(
          req.params.id,
          {
            $set: { password: req.body.password },
          },
          { new: true }
        );
        res.status(201).send(updatedPassword);
      } catch (error) {
        res.status(404).json(error);
      }
    } else {
      res.status(404).send('Email not valid');
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = { registerUser, loginUser, logoutUser, updatePasword };
