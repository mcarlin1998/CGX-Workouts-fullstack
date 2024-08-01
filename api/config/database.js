const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/workoutsdb',
      { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }
    )
    console.log("Connected to MongoDB")
  } catch (err) {
    console.log("MongoDB connection error:", err)
    process.exit(1);
  }
};

module.exports = connectDB