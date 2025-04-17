const express = require("express");
const logger = require('./logger');
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const appRoutes = require("./src/routes/appRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error('Error connecting to MongoDB:', err));

const db = mongoose.connection;


// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', (err) => logger.error('MongoDB connection error:', err));

db.once('open', function () {
  logger.info('Connected to the database');  
});

app.use('/api', appRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
