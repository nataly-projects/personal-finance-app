const express = require("express");
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
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  // set the default connection
const db = mongoose.connection;

// bind connection to error event - to get notifications of connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function () {
    console.log('Connected to the database');  
});

app.use('/api', appRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
