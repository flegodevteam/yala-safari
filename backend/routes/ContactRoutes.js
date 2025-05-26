const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();
const twilio = require("twilio");
const nodemailer = require("nodemailer");

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Twilio Phone Number
const client = twilio(accountSid, authToken);

console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Handle contact form submission
router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  const newContact = new Contact({
    name,
    email,
    phone,
    message,
  });

  try {
    const savedContact = await newContact.save();
    res
      .status(201)
      .json({
        message: "Contact form submitted successfully",
        data: savedContact,
      });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error submitting contact form", error: err.message });
  }

  // Send an email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Send to the user's email
    subject: "Thank you for contacting us!",
    text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message:\n\n"${message}"\n\nWe will get back to you shortly.\n\nBest regards,\nYala Safari Team`,
  };

  await transporter.sendMail(mailOptions);

  // Send an SMS
try {
    const smsResponse = await client.messages.create({
      body: `Hi ${name}, thank you for contacting us. We have received your message: "${message}". We will get back to you shortly.`,
      from: twilioPhoneNumber,
      to: phone, // Send to the user's phone number
    });
  
    console.log('SMS sent successfully:', smsResponse.sid);
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }

  // Send an SMS
  await client.messages.create({
    body: `Hi ${name}, thank you for contacting us. We have received your message: "${message}". We will get back to you shortly.`,
    from: twilioPhoneNumber,
    to: phone, // Send to the user's phone number
  });
});

module.exports = router;
