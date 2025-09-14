import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Basic health endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve the wrapper at root
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback: 404
app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log(`[n8n-chat-wrapper] Server listening on port ${PORT}`);
});
