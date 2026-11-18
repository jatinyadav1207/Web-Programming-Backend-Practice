# Web Programming Backend Practice

An Express API for practising user registration, login, logout and post CRUD with MongoDB Atlas. Based on the [freeCodeCamp video](https://www.youtube.com/watch?v=KOutPbKc9UM&t=2s) and [Shivani's tutorial repository](https://github.com/NewSmoke38/intro-to-backend).

## Run locally

1. In the repository root, run `npm ci`.
2. In PowerShell, run `Copy-Item .env.example .env` if you do not already have a local `.env`.
3. In your existing Atlas cluster, open **Connect → Drivers** and copy the connection string. Privately paste it into `.env` as `MONGODB_URI`. Use a database user with read/write access to the assignment database and add your current public IP to the Atlas IP Access List. Percent-encode any special characters in the database password inside the URI.
4. Include a database name such as `web_programming_backend_practice` after the host and before the query string, as in `mongodb+srv://<user>:<password>@<host>/web_programming_backend_practice?retryWrites=true&w=majority`. The local `.env` is ignored by Git.
5. Run `npm run dev` for automatic restarts or `npm start` to run once. When Atlas connects, the server listens at `http://127.0.0.1:4000` by default.

## API endpoints

Use `Content-Type: application/json` when sending a body.

| Method | Path | JSON body | Success |
| --- | --- | --- | --- |
| POST | `/api/v1/users/register` | `username`, `email`, `password` | 201 with user ID, email and username |
| POST | `/api/v1/users/login` | `email`, `password` | 200 with user ID, email and username |
| POST | `/api/v1/users/logout` | `email` | 200 with confirmation |
| POST | `/api/v1/posts/create` | `name`, `description`, `age` | 201 with the new post |
| GET | `/api/v1/posts/getPosts` | None | 200 with an array of posts |
| PATCH | `/api/v1/posts/update/:id` | One or more of `name`, `description`, `age` | 200 with the updated post |
| DELETE | `/api/v1/posts/delete/:id` | None | 200 with confirmation |

Usernames are 1–30 characters. Passwords are 6–50 characters and up to 72 UTF-8 bytes. Age must be between 1 and 150. Use the post's `_id` in the update and delete paths. Invalid input returns 400 and missing posts on update or delete return 404.

As in the tutorial, login verifies a bcrypt password hash and returns the user's public fields. Logout checks the email and returns a confirmation. There are no sessions or tokens, and the post routes are public.

## Test with Postman

1. Start the server and wait for the Atlas connection message.
2. In Postman, choose **Import** and select `Web-Programming-Backend-Practice.postman_collection.json`. Use the desktop app or the desktop agent for localhost requests.
3. Keep `baseUrl` at `http://127.0.0.1:4000`, or update it if you changed the port.
4. Run the collection in order. Register generates a unique practice user for Login and Logout. Create Post saves `postId` for List, Update and Delete. The run removes its post and leaves the practice user in the database.

## Differences from the tutorial

The project follows the tutorial's file layout, models, route names and HTTP methods. It defaults to port 4000, listens on loopback, omits the URI from logs and uses generic server errors. The bcrypt hook uses async Mongoose middleware. Request validation returns 400 for invalid inputs, and post updates validate the three schema fields. Nodemon is installed as a development dependency. The assignment adds a sample environment file and a Postman collection.
