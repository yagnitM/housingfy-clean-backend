const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const userRoutes = require('./routes/userRoutes');
const societyRoutes = require('./routes/societyRoutes');

dotenv.config();
const app = express();

// 🔧 CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://housingfy-clean-frontend.vercel.app',
    'https://housingfy-clean-frontend2.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// 🔄 Enable CORS middleware for all routes
app.use(cors(corsOptions));

// 🔄 Explicitly handle preflight requests (important for CORS with credentials + auth headers)
app.options('*', cors(corsOptions));

// 🛡️ Debug CORS issues - log incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path} from ${req.headers.origin}`);
  next();
});

// 🧠 Parse incoming JSON
app.use(express.json());

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Housingfy Backend is Running Successfully!");
});

// 🔀 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/societies', societyRoutes);

// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ⚠️ Custom Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unexpected Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// 🚀 Start Server
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
