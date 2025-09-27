const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db'); 
dotenv.config();

connectDB();

const app = express();

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Body parser for JSON

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/influencer', require('./api/influencerRoutes')); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
