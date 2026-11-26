import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { createPostsRouter } from './server/posts.js';

const app = express();
const server = createServer(app);
const port = Number(process.env.PORT ?? 3000);

app.use('/posts', createPostsRouter());

if (process.argv.includes('--dev')) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server } },
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(fileURLToPath(new URL('./dist/', import.meta.url))));
}

server.listen(port, '127.0.0.1', () => {
  console.log(`Mini-Twitter is running at http://localhost:${server.address().port}`);
});
