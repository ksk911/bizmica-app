const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const directorRoutes = require('./routes/director');
app.use('/api/director', directorRoutes);

app.get('/', (req, res) => {
  res.send('BizAmica Backend API is running.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
