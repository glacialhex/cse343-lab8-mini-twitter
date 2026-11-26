# Mini-Twitter REST API

Start the Express server with `npm ci` followed by `node --run dev`. The default base URL is `http://localhost:3000`. To use the port shown in the report, start with `PORT=3008 node --run dev` and send requests to `http://localhost:3008`.

Send a JSON body and the `Content-Type: application/json` header with `POST` and `PUT` requests. Replace `:id` in the paths below with the numeric ID returned when creating a post.

The server stores post objects in a JavaScript array. Each post has its own array of comment objects. The list starts empty, and restarting the server clears all posts and comments.

## Endpoints

| Method | Path | Success |
| --- | --- | --- |
| `POST` | `/posts` | `201 Created` |
| `GET` | `/posts` | `200 OK` |
| `GET` | `/posts/:id` | `200 OK` |
| `PUT` | `/posts/:id` | `200 OK` |
| `POST` | `/posts/:id/comments` | `201 Created` |
| `GET` | `/posts/:id/comments` | `200 OK` |
| `DELETE` | `/posts/:id` | `204 No Content` |

### Create a post

`POST /posts` takes a non-blank `name` and `content`. The body may use `title` in place of `name`. The server assigns the post ID.

```json
{ "name": "First post", "content": "Hello!" }
```

The response has status `201 Created`, the header `Location: /posts/1`, and the new post object. Use its actual `id` in later requests.

```json
{ "id": 1, "name": "First post", "content": "Hello!" }
```

### List posts

`GET /posts` returns `200 OK` and an array of posts. A fresh server returns `[]`.

```json
[{ "id": 1, "name": "First post", "content": "Hello!" }]
```

### Read a post

`GET /posts/1` returns `200 OK` and the requested post.

```json
{ "id": 1, "name": "First post", "content": "Hello!" }
```

### Edit a post

`PUT /posts/1` replaces both editable text fields. Supply a non-blank `name` or `title` and non-blank `content`.

```json
{ "name": "Edited post", "content": "Updated text." }
```

The response is `200 OK` with the edited post.

```json
{ "id": 1, "name": "Edited post", "content": "Updated text." }
```

### Add a comment

`POST /posts/1/comments` takes a non-blank `comment` string.

```json
{ "comment": "Nice post!" }
```

The response is `201 Created` with the new comment object.

```json
{ "comment": "Nice post!" }
```

### List comments

`GET /posts/1/comments` returns `200 OK` and an array of comments for that post. A post with zero comments returns `[]`.

```json
[{ "comment": "Nice post!" }]
```

### Delete a post

`DELETE /posts/1` removes the post and its comments. A successful response is `204 No Content` with an empty body. Sending `GET /posts/1` afterward returns `404 Not Found`.

## Errors

| Status | Condition | Example JSON response |
| --- | --- | --- |
| `400 Bad Request` | Missing or blank post fields | `{ "error": "A post needs a title and content." }` |
| `400 Bad Request` | Missing or blank comment text | `{ "error": "A comment needs text." }` |
| `400 Bad Request` | Malformed JSON | `{ "error": "Request body must be valid JSON." }` |
| `404 Not Found` | The post ID does not exist | `{ "error": "Post not found." }` |
| `404 Not Found` | No matching endpoint under `/posts` | `{ "error": "Endpoint not found." }` |

## Postman

Import [Mini-Twitter.postman_collection.json](Mini-Twitter.postman_collection.json) into a Postman workspace and select the **CSE343 Mini-Twitter** collection. Its `baseUrl` variable defaults to the server on port 3000. Run **Create post** before the remaining requests so the collection can reuse the returned `postId`. Run **Delete a post** last.

In Postman Local Mode, open an HTTP request tab and enter the method, URL, and JSON from the examples above. Select **Body → raw → JSON** for requests that send a body.
