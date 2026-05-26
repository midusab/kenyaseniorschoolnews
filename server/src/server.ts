import express from 'express';
import cors from 'cors';
import { connectDB, db } from './config/db';
import authRoutes from './routes/authRoutes';
import schoolRoutes from './routes/schoolRoutes';
import articleRoutes from './routes/articleRoutes';

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Main sub-agency API routes registration
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/articles', articleRoutes);

// Additional scholarships query API mapping persistent collections
app.get('/api/scholarships', async (req, res) => {
  try {
    const list = await db.find('scholarships');
    res.status(200).json(list);
  } catch (err) {
    console.error('Failed to retrieve scholarships metadata:', err);
    res.status(500).json({ error: 'Server scholarship index pull failed' });
  }
});

// Self-check health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', serverTime: new Date().toISOString() });
});

export async function initializeApplication() {
  await connectDB();
  return app;
}

export default app;
