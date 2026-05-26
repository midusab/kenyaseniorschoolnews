import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import app, { initializeApplication } from './server/src/server';

const PORT = 3000;

async function bootstrap() {
  // Initialize DB and load collections
  await initializeApplication();

  // Attach Vite assets and SPA configuration layers
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Use Vite middleware to process static files & hot updates
    app.use(vite.middlewares);
    console.log('Vite SPA Asset middleware mounted successfully (Dev Mode).');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static client files serving from dist/ folder.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kenya Senior School News Network (KSSNN) backend active on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal: Backend application crashed on boot:', err);
});
