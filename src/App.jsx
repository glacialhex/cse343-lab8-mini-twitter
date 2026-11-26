import { useEffect, useState } from 'react';
import PostList from './components/PostList';
import NewPostForm from './components/NewPostForm';
import SinglePostView from './components/SinglePostView';
import NewCommentForm from './components/NewCommentForm';
import {
  MOCK_MODE,
  createNewComment,
  createNewPost,
  deletePost,
  getAllPosts,
  getPostDetails,
  updatePost,
} from './api/api';

export default function App() {
  const [posts, setPosts] = useState(null);
  const [details, setDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        const data = await getAllPosts();
        if (active) setPosts(data);
      } catch (error) {
        if (active) {
          setError(error.message);
          setPosts([]);
        }
      }
    }

    loadPosts();
    return () => { active = false; };
  }, []);

  async function run(action) {
    setBusy(true);
    setError('');
    try {
      await action();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  function selectPost(postId) {
    return run(async () => {
      setDetails(await getPostDetails(postId));
    });
  }

  function backToPosts() {
    setDetails(null);
    setEditing(false);
    setError('');
  }

  function showEditor(open) {
    setEditing(open);
    setError('');
  }

  function saveNewPost(data) {
    return run(async () => {
      const post = await createNewPost(data);
      if (post) setPosts((current) => [...current, post]);
    });
  }

  function saveEditedPost(data) {
    return run(async () => {
      const post = await updatePost(details.post.id, data);
      if (post) {
        setDetails({ ...details, post });
        setPosts((current) => current.map((item) => item.id === post.id ? post : item));
      }
      setEditing(false);
    });
  }

  function removePost() {
    return run(async () => {
      const id = details.post.id;
      await deletePost(id);
      if (!MOCK_MODE) setPosts((current) => current.filter((post) => post.id !== id));
      backToPosts();
    });
  }

  function saveComment(data) {
    return run(async () => {
      const comment = await createNewComment(details.post.id, data);
      if (comment) setDetails({ ...details, comments: [...details.comments, comment] });
    });
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Mini-Twitter</h1>
      {MOCK_MODE && <p>Mock mode serves saved examples.</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {details ? (
        <>
          <button type="button" onClick={backToPosts} disabled={busy}>
            &larr; Back to Posts
          </button>
          {editing ? (
            <NewPostForm
              post={details.post}
              onSave={saveEditedPost}
              onCancel={() => showEditor(false)}
              busy={busy}
            />
          ) : (
            <>
              <SinglePostView post={details.post} comments={details.comments}>
                <div className="actions">
                  <button type="button" onClick={() => showEditor(true)} disabled={busy}>Edit Post</button>
                  <button type="button" onClick={removePost} disabled={busy}>Delete Post</button>
                </div>
              </SinglePostView>
              <NewCommentForm onCreateComment={saveComment} busy={busy} />
            </>
          )}
        </>
      ) : (
        <>
          <NewPostForm onSave={saveNewPost} busy={busy || posts === null} />
          {posts === null
            ? <p role="status">Loading posts…</p>
            : <PostList posts={posts} onSelectPost={selectPost} busy={busy} />}
        </>
      )}
    </main>
  );
}
