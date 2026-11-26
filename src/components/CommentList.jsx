const CommentList = ({ comments }) => {
  return (
    <div>
      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index} style={{ borderTop: '1px solid #eee', padding: '8px 0' }}>
            <p className="post-content">{comment.comment}</p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default CommentList;
