
const express = require("express");
const router = express.Router();

const Interview = require("../models/Interview");
const auth = require("../authCheck/auth");

// Create Interview
router.post("/interview", auth, async (req, res) => {
  try {
    const {
      experience,
      role,
      difficulty,
      interviewType,
      numberOfQuestions,
      questions,
    } = req.body;

    // Validation
    if (
      !experience ||
      !role ||
      !difficulty ||
      !interviewType ||
      !numberOfQuestions ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        msg: "Please fill all fields properly",
      });
    }

    // Save interview in MongoDB
    const interview = await Interview.create({
      userId: req.user._id,
      experience,
      role,
      difficulty,
      interviewType,
      numberOfQuestions,
      questions,
    });

    return res.status(201).json({
      msg: "Interview created successfully",
      interview,
    });
  } catch (err) {
    console.error("Interview Error:", err);

    return res.status(500).json({
      msg: "Something went wrong",
      error: err.message,
    });
  }
});

module.exports = router;