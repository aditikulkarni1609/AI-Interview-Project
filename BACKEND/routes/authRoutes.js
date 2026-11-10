const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const GOOGLE_CLIENT_ID = "623709705949-gkmhmtl5rrgaetkitcphg65874584857tca4prqin1.apps.googleusercontent.com";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Add it to BACKEND/.env - see .env.example");
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {

  try {

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      name,
      email,
      picture,
    } = payload;

    let user = await User.findOne({ email });

    if (!user) {

      user = await User.create({
        googleId,
        name,
        email,
        profilePicture: picture,
      });

    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Google Login Successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log("Google Login Error:", error);

    res.status(500).json({
      message: "Google authentication failed",
    });

  }

});

module.exports = router;
