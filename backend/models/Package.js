const mongoose = require('mongoose');

const jeepPricingSchema = new mongoose.Schema({
  morning: Number,
  afternoon: Number,
  extended: Number,
  fullDay: Number,
});

const packageSchema = new mongoose.Schema({
  jeep: {
    basic: jeepPricingSchema,
    luxury: jeepPricingSchema,
    superLuxury: jeepPricingSchema,
  },
  shared: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
    6: Number,
    7: Number,
  },
  meals: {
    breakfast: Number,
    lunch: Number,
  },
  guide: {
    driver: Number,
    driverGuide: Number,
    separateGuide: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);