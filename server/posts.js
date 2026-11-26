import { Router, json } from 'express';

function readPostFields(body) {
  const name = body?.name ?? body?.title;
  const content = body?.content;
  if (typeof name !== 'string' || typeof content !== 'string' || !name.trim() || !content.trim()) {
    return null;
  }
  return { name: name.trim(), content: content.trim() };
}

function postResponse({ id, name, content }) {
  return { id, name, content };
}

export function createPostsRouter() {
  const router = Router();
  const posts = [];
  let nextPostId = 1;

  router.use(json());

  router.get('/', (_req, res) => {
    res.json(posts.map(postResponse));
  });

  router.post('/', (req, res) => {
    const fields = readPostFields(req.body);
    if (!fields) {
      return res.status(400).json({ error: 'A post needs a title and content.' });
    }

    const post = { id: nextPostId++, ...fields, comments: [] };
    posts.push(post);
    return res.location(`/posts/${post.id}`).status(201).json(postResponse(post));
  });

  router.param('id', (_req, res, next, id) => {
    const post = posts.find((item) => String(item.id) === id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.locals.post = post;
    next();
  });

  router.get('/:id', (_req, res) => {
    res.json(postResponse(res.locals.post));
  });

  router.put('/:id', (req, res) => {
    const fields = readPostFields(req.body);
    if (!fields) {
      return res.status(400).json({ error: 'A post needs a title and content.' });
    }

    const post = res.locals.post;
    Object.assign(post, fields);
    return res.json(postResponse(post));
  });

  router.delete('/:id', (_req, res) => {
    posts.splice(posts.indexOf(res.locals.post), 1);
    res.status(204).end();
  });

  router.get('/:id/comments', (_req, res) => {
    res.json(res.locals.post.comments);
  });

  router.post('/:id/comments', (req, res) => {
    const text = req.body?.comment;
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'A comment needs text.' });
    }

    const comment = { comment: text.trim() };
    res.locals.post.comments.push(comment);
    return res.status(201).json(comment);
  });

  router.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint not found.' });
  });

  router.use((error, _req, res, next) => {
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Request body must be valid JSON.' });
    }
    next(error);
  });

  return router;
}
