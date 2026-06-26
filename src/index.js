require('dotenv').config();
const express = require('express');
const cors = require('cors');
const refundLogic = require('./services/refundLogic');
const voiceService = require('./services/voiceService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

// Main refund API
app.post('/api/refund', (req, res) => {
  try {
    const { customerId, amount, daysSincePurchase } = req.body;

    if (!customerId || !amount) {
      return res.status(400).json({ 
        error: 'Missing customerId or amount' 
      });
    }

    const result = refundLogic.processRefund(customerId, amount, daysSincePurchase);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Voice API endpoint
app.post('/api/voice', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const audioBase64 = await voiceService.textToSpeech(text);
    res.json({ audio: audioBase64 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n Backend running on http://localhost:${PORT}`);
  console.log(` Try: http://localhost:${PORT}/health\n`);
});