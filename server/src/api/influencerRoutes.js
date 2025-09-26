// API logic 

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
// const Influencer = require('../models/Influencer');

// @route   GET /api/influencer/:username
// @desc    Get influencer profile data (currently from mock file)
// @access  Public
router.get('/:username', async (req, res) => {
  try {
    // The path goes up one directory from /server, then into /client.
    const mockFilePath = path.join(__dirname, '../../../client/public/mockProfile.json');
    const data = await fs.readFile(mockFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;