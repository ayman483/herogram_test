const express = require('express');
const sequelize = require('./config/db');
var cors = require("cors");
require('dotenv').config();

const authRoutes = require('./auth/routes');
const fileRoutes = require('./file-management/routes');

const app = express();
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

// Sync DB and start server
sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
});
