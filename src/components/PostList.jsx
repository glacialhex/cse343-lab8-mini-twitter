const PostList = ({ posts, onSelectPost, busy }) => {
  return (
    <div>
      <h2>Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map(post => (
        <article key={post.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>
            <button type="button" className="post-link" onClick={() => onSelectPost(post.id)} disabled={busy}>
              {post.name}
            </button>
          </h3>
          <p className="post-content">{post.content}</p>
        </article>
      ))}
    </div>
  );
};

export default PostList;
