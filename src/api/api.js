const apiUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
export const MOCK_MODE = import.meta.env.MODE === 'mock';

async function request(path, { method = 'GET', body } = {}) {
  const options = { method };
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${apiUrl}${path}`, options);
  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    const message = typeof problem?.error === 'string' ? problem.error : null;
    throw new Error(message ?? `${method} ${path} failed (HTTP ${response.status}).`);
  }

  // The course mock can return an empty body for a successful write.
  if (response.status !== 204 && (method === 'GET' || !MOCK_MODE)) {
    return response.json();
  }
}

function postPath(postId) {
  return `/posts/${encodeURIComponent(postId)}`;
}

export function getAllPosts() {
  return request('/posts');
}

export async function getPostDetails(postId) {
  const path = postPath(postId);
  const [post, comments] = await Promise.all([
    request(path),
    request(`${path}/comments`),
  ]);
  return { post, comments };
}

export function createNewPost(post) {
  return request('/posts', { method: 'POST', body: post });
}

export function updatePost(postId, post) {
  return request(postPath(postId), { method: 'PUT', body: post });
}

export function deletePost(postId) {
  return request(postPath(postId), { method: 'DELETE' });
}

export function createNewComment(postId, comment) {
  return request(`${postPath(postId)}/comments`, { method: 'POST', body: comment });
}
