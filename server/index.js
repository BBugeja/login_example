// basic server setup with express serving static files with a login endpoint
import express from 'express';
import rateLimit from 'express-rate-limit';
import expressSession from 'express-session';
import cors from 'cors';

import authRoutes from './auth/auth.routes.js';
import { requireAuth } from './middleware/requireAuth.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET ?? 'mySecret',
    resave: false,
    saveUninitialized: false,
    store: new expressSession.MemoryStore(), // In-memory store for session data, not for production
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'lax', // 'lax' means cookies are sent for same-site requests and cross-origin GET requests
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    },
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(requireAuth('/auth-wall.html'));
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/auth', authRoutes);
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.listen(PORT);
