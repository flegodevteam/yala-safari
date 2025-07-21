const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { email, paymentStatus } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { email },
      { paymentStatus },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Payment status updated", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment status" });
  }
};
