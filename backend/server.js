const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const requestRoutes = require('./routes/requestRoutes');
const classRoutes = require('./routes/classRoutes');

const app = express();
app.use(cors());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
connectDB();  

// Use routes
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/classes', classRoutes);

app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));