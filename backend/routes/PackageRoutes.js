const express = require('express');
const Package = require('../models/Package');
const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single package by ID
router.get('/:id', getPackage, (req, res) => {
  res.json(res.package);
});

// Create a new package
router.post('/', async (req, res) => {
  const newPackage = new Package({
    name: req.body.name,
    price: req.body.price,
    duration: req.body.duration,
    status: req.body.status || 'active',
  });

  try {
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a package
router.patch('/:id', getPackage, async (req, res) => {
  const { name, price, duration, status } = req.body;
  if (name !== undefined) res.package.name = name;
  if (price !== undefined) res.package.price = price;
  if (duration !== undefined) res.package.duration = duration;
  if (status !== undefined) res.package.status = status;

  try {
    const updated = await res.package.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a package
router.delete('/:id', getPackage, async (req, res) => {
  try {
    await res.package.deleteOne();
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware
async function getPackage(req, res, next) {
  let found;
  try {
    found = await Package.findById(req.params.id);
    if (!found) return res.status(404).json({ message: 'Package not found' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.package = found;
  next();
}

module.exports = router;
