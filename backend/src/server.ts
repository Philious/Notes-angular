import cors from 'cors';
import { config } from './config';
import express from 'express';
import { getAllNotes, getNote, newNote, updateNote, deleteNote } from './controllers/notes';
import { newUser, login, checkStatus, logout } from './controllers/user';
import { authenticate } from './auth';

const app = express();
const port = config.port;
const origin = config.origin;

app.use(
  cors({
    origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(express.json());

app.post('/users', newUser);
app.post('/users/login', login);
app.delete('/users/logout', authenticate, logout);
app.post('/users/check', checkStatus);

app.get('/notes/all', authenticate, getAllNotes);
app.get('/notes/:noteId', authenticate, getNote);
app.post('/notes', authenticate, newNote);
app.put('/notes', authenticate, updateNote);
app.delete('/notes/:noteId', authenticate, deleteNote);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
