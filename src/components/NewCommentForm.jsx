import { useState } from 'react';

const NewCommentForm = ({ onCreateComment, busy }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await onCreateComment({ comment })) setComment('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <h3>Add a Comment</h3>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="comment">Your comment</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={busy}
          required
          style={{ width: '100%', padding: '8px', minHeight: '60px' }}
        />
      </div>
      <button type="submit" disabled={busy || !comment.trim()}>Add Comment</button>
    </form>
  );
};

export default NewCommentForm;
