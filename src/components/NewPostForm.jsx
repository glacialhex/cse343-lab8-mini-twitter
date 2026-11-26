import { useState } from 'react';

const NewPostForm = ({ post, onSave, onCancel, busy }) => {
  const [name, setName] = useState(post?.name ?? '');
  const [content, setContent] = useState(post?.content ?? '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const saved = await onSave({ name, content });
    if (saved && !post) {
      setName('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
      <h2>{post ? 'Edit Post' : 'Create a New Post'}</h2>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="post-content">Content</label>
        <textarea
          id="post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={busy}
          required
          style={{ width: '100%', padding: '8px', minHeight: '80px' }}
        />
      </div>
      <div className="actions">
        <button type="submit" disabled={busy || !name.trim() || !content.trim()}>
          {post ? 'Save Changes' : 'Post'}
        </button>
        {post && <button type="button" onClick={onCancel} disabled={busy}>Cancel</button>}
      </div>
    </form>
  );
};

export default NewPostForm;
