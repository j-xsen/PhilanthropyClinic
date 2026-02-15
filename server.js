// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import checkoutHandler from './api/checkout.ts';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Wrap the serverless handler for Express
app.post('/api/checkout', async (req, res) => {
    try {
        await checkoutHandler(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
