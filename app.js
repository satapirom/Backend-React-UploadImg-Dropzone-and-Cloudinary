const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const cloudinary = require('./utils/cloudinaryConfig')
const cors = require('cors');

const connectDB = require('./utils/connectDB')
const Image = require('./models/Image');

const imagesRoute = require('./routes/imagesRoute');

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the environment variables.');
  process.exit(1); // ออกจากโปรแกรมถ้าตัวแปร MONGO_URI ไม่ถูกกำหนด
}



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);  // เพิ่มการ log ข้อผิดพลาดที่นี่
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message,
  });
});


connectDB();

app.use('/', imagesRoute);


app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
