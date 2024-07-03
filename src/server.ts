import express from 'express';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import userRoutes from './routes/userRoutes';
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/users', authRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});