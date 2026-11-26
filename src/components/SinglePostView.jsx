import CommentList from './CommentList';

const SinglePostView = ({ post, comments, children }) => {
  return (
    <div>
      <h2>{post.name}</h2>
      <p className="post-content">{post.content}</p>
      {children}
      <hr />
      <CommentList comments={comments} />
    </div>
  );
};

export default SinglePostView;
