import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/db/database.js';
import router from './src/routes/index.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API IS RUNNING');
});

app.use('/api/messenger', router);

const startServer = async () => {
  const PORT = process.env.PORT || 8896;

  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`APP IS RUNNING ON PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
