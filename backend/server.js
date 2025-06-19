const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// File paths
const CSV_FILE = path.join(__dirname, 'flex_log.csv');
const BASELINE_FILE = path.join(__dirname, 'baseline.txt');

// Ensure CSV has headers
if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(CSV_FILE, 'timestamp,flex_value,label\n');
}

// Load baseline from file on startup
let currentBaseline = 0;
if (fs.existsSync(BASELINE_FILE)) {
  const value = fs.readFileSync(BASELINE_FILE, 'utf8');
  currentBaseline = parseInt(value) || 0;
}

// Set baseline
app.get('/set_baseline', (req, res) => {
  const value = parseInt(req.query.value);
  if (!isNaN(value)) {
    currentBaseline = value;
    fs.writeFileSync(BASELINE_FILE, String(currentBaseline));
    console.log(`Baseline set to: ${currentBaseline}`);
    res.status(200).json({ success: true, baseline: currentBaseline });
  } else {
    res.status(400).json({ success: false, message: 'Invalid value' });
  }
});

// Get baseline
app.get('/get_baseline', (req, res) => {
  res.status(200).json({ baseline: currentBaseline });
});

// Log flex sensor value
app.get('/log', (req, res) => {
  const { value, label } = req.query;
  if (!value || !label) {
    return res.status(400).send('Missing value or label');
  }

  const timestamp = new Date().toISOString();
  const entry = `${timestamp},${value},${label}\n`;

  fs.appendFile(CSV_FILE, entry, err => {
    if (err) {
      console.error('Error writing to CSV:', err);
      return res.status(500).send('Error writing to file');
    }
    console.log(`Logged: ${entry.trim()}`);
    res.send('Logged successfully');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
