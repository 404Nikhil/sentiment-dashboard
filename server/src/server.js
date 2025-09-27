const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db'); 
const axios = require('axios');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/image-proxy', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('Image URL is required');
  }

  try {
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream'
    });
    response.data.pipe(res);
  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(500).send('Failed to fetch image');
  }
});

app.use('/api/influencer', require('./api/influencerRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));