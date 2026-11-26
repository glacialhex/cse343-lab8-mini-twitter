# CSE343 Web Development Labs 7 and 8

## Run Mini-Twitter with the Express API

Use Node.js 22 or later. Run these commands from this directory.

```sh
npm ci
node --run dev
```

Open the app at [localhost:3000](http://localhost:3000). The feed starts empty. Create a post to open its detail view, edit it, add a comment, or delete it.

The Express server stores posts as objects in an array. Each post has its own array of comment objects. Restarting the server clears the data.

### Lab 8 REST API

See the [API documentation](API.md) for request and response examples, required fields, and error responses.

| Method and path | JSON request body | Success |
| --- | --- | --- |
| `GET /posts` | | `200` and the array of posts |
| `POST /posts` | `{ "name": "First post", "content": "Hello!" }` | `201` and the created post |
| `GET /posts/:id` | | `200` and the selected post |
| `PUT /posts/:id` | `{ "name": "Edited post", "content": "Updated text." }` | `200` and the updated post |
| `DELETE /posts/:id` | | `204` with an empty body |
| `GET /posts/:id/comments` | | `200` and the selected post's comments |
| `POST /posts/:id/comments` | `{ "comment": "Nice post!" }` | `201` and the created comment |

Post responses contain a numeric `id`, `name`, and `content`. The create and update routes also accept `title` as the input field for `name`, as in the Lab 8 slide. Use `PUT` to replace both text fields. Deleting a post also removes its comments.

An invalid or missing required field returns `400` with a JSON error. A route that references a missing post returns `404`.

## Run the Lab 7 Postman mock

The React API client uses `async` and `await fetch()` in `src/api/api.js`. To use the course's Postman mock, run the command below and open the URL printed by Vite. The mock serves saved examples for read and write requests. [Course starter](https://github.com/mina58/lab-8-web) · [Course collection](https://www.postman.com/mshawket-1983809/mock-server/collection/yskidph/mini-twitter)

```sh
node --run dev:mock
```

### Use the included Postman collection

Import `Mini-Twitter.postman_collection.json` into Postman. Its `baseUrl` defaults to the local Express server. Running the requests in order creates a post, uses the returned ID for the remaining requests, and deletes that post at the end.

To use your own Lab 7 mock, create a public mock from the collection's saved examples in Postman and use its URL in the following command. [Postman mock server documentation](https://learning.postman.com/docs/design-apis/mock-apis/mock-servers/overview/)

```sh
VITE_API_URL=https://your-mock-id.mock.pstmn.io node --run dev:mock
```

## Check the project

Run `node --run lint` and `node --run build`. After building, `node --run start` serves the built React app and the Express API together.
