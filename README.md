
Our project, Grub Gurus, is a food-focused recipe-sharing platform that combines StackOverflow-style Q&A features with social media elements. It aims to create a centralized space where users can save recipes, ask and answer cooking-related questions, and plan meals. A scrollable feed allows users to engage with posts in a social format, including the ability to embed YouTube videos to showcase full recipes or specific cooking techniques, making the platform both informative and interactive.

### Deployed website URL:
  - https://grub-gurus.onrender.com/

## Getting Started

- Environment Variables (.env):

  - Client

    - REACT_APP_SERVER_URL = http://localhost:8000
    - REACT_APP_API_KEY = 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

  - Server
    - MONGODB_URI = mongodb://127.0.0.1:27017
    - CLIENT_URL = http://localhost:3000
    - PORT = 8000

- Setup Commands:
- Pull or fork from the Github repo located at: https://github.com/neu-cs4530/spring25-team-project-spring25-project-group-206.git

- Once on your local computer:
- Add .env files to both the _client_ and _server_ directories (information above).

Run from terminal:

- `npm install` in the root directory to install all dependencies for the `client`, `server`, and `shared` folders.
- `npm run start`, in both the _client_ and _server_ directories
- Deployed website URL:
  - https://cs4530-s25-206.onrender.com

Connect to your MongoDB compass with the connection string of: mongodb://localhost:27017/

{ : .note } Refer to [IP1](https://neu-se.github.io/CS4530-Spring-2025/assignments/ip1) and [IP2](https://neu-se.github.io/CS4530-Spring-2025/assignments/ip2) for further instructions related to setting up MongoDB, setting environment variables, and running the client and server.

## Codebase Folder Structure

- `client`: Contains the frontend application code, responsible for the user interface and interacting with the backend. This directory includes all React components and related assets.
- `server`: Contains the backend application code, handling the logic, APIs, and database interactions. It serves requests from the client and processes data accordingly.
- `shared`: Contains all shared type definitions that are used by both the client and server. This helps maintain consistency and reduces duplication of code between the two folders. The type definitions are imported and shared within each folder's `types/types.ts` file.

## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](class-diagram.png)

## API Routes

### `/answer`

| Endpoint   | Method | Description      |
| ---------- | ------ | ---------------- |
| /addAnswer | POST   | Add a new answer |

### `/comment`

| Endpoint    | Method | Description       |
| ----------- | ------ | ----------------- |
| /addComment | POST   | Add a new comment |

### `/messaging`

| Endpoint     | Method | Description           |
| ------------ | ------ | --------------------- |
| /addMessage  | POST   | Add a new message     |
| /getMessages | GET    | Retrieve all messages |

### `/question`

| Endpoint          | Method | Description                     |
| ----------------- | ------ | ------------------------------- |
| /getQuestion      | GET    | Fetch questions by filter       |
| /getQuestionById/ | GET    | Fetch a specific question by ID |
| /addQuestion      | POST   | Add a new question              |
| /upvoteQuestion   | POST   | Upvote a question               |
| /downvoteQuestion | POST   | Downvote a question             |

### `/tag`

| Endpoint                   | Method | Description                                   |
| -------------------------- | ------ | --------------------------------------------- |
| /getTagsWithQuestionNumber | GET    | Fetch tags along with the number of questions |
| /getTagByName/             | GET    | Fetch a specific tag by name                  |

### `/user`

| Endpoint                 | Method | Description                                         |
| ------------------------ | ------ | --------------------------------------------------- |
| /signup                  | POST   | Create a new user account                           |
| /login                   | POST   | Log in as a user                                    |
| /resetPassword           | PATCH  | Reset user password                                 |
| /getUser/                | GET    | Fetch user details by username                      |
| /getUsers                | GET    | Fetch all users                                     |
| /deleteUser/             | DELETE | Delete a user by username                           |
| /updateBiography         | PATCH  | Update user biography                               |
| /updateRecipeBookPrivacy | PATCH  | Update user's recipe book privacy setting biography |
| /followUser              | PATCH  | Update user following list                          |
| /updatePrivacy           | PATCH  | Update user profile privacy setting                 |
| /savePost                | PATCH  | Saves/removes post from user's saved posts list     |

### `/chat`

| Endpoint                    | Method | Description                                                                 |
| --------------------------- | ------ | --------------------------------------------------------------------------- |
| `/createChat`               | POST   | Create a new chat.                                                          |
| `/:chatId/addMessage`       | POST   | Add a new message to an existing chat.                                      |
| `/:chatId`                  | GET    | Retrieve a chat by its ID, optionally populating participants and messages. |
| `/:chatId/addParticipant`   | POST   | Add a new participant to an existing chat.                                  |
| `/getChatsByUser/:username` | GET    | Retrieve all chats for a specific user based on their username.             |

### `/games`

| Endpoint | Method | Description           |
| -------- | ------ | --------------------- |
| /create  | POST   | Create a new game     |
| /join    | POST   | Join an existing game |
| /leave   | POST   | Leave a game          |
| /games   | GET    | Retrieve all games    |

### `/posts`

| Endpoint                     | Method | Description                                           |
| ---------------------------- | ------ | ----------------------------------------------------- |
| /addPost                     | POST   | Saves a new post                                      |
| /getPost                     | GET    | Retrieves an existing post                            |
| /getFollowingPosts/:username | GET    | Gets posts from users that the logged in user follows |
| /updatePostLikes             | PATCH  | Updates number of likes on a post                     |

### `/recipe`

| Endpoint                 | Method | Description                          |
| ------------------------ | ------ | ------------------------------------ |
| /getRecipes/:username    | GET    | Gets recipes given a user's username |
| /addRecipe               | POST   | Creates a new recipe                 |
| /addCalendarRecipe       | POST   | Creates a new calendar recipe        |
| /updateRecipeForCalendar | PATCH  | Updates a calendar recipe            |

## Running Stryker Mutation Testing

Mutation testing helps you measure the effectiveness of your tests by introducing small changes (mutations) to your code and checking if your tests catch them. To run mutation testing with Stryker, use the following command in `server/`:

```sh
npm run stryker
```

{ : .note } In case you face an "out of memory" error while running Stryker, use the following command to increase the memory allocation to 4GB for Node.js:

```sh
node --max-old-space-size=4096 ./node_modules/.bin/stryker run
```
## Contributors
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/haderie">
        <img src="https://github.com/haderie.png" width="50" />
      </a><br/>
      <sub><strong>Hareg Aderie</strong></sub>
    </td>
    <td align="center">
      <a href="https://github.com/NGoyal18">
        <img src="https://github.com/NGoyal18.png" width="50" />
      </a><br/>
      <sub><strong>Nandini Goyal</strong></sub>
    </td>
    <td align="center">
      <a href="https://github.com/ibbymcc">
        <img src="https://github.com/ibbymcc.png" width="50" />
      </a><br/>
      <sub><strong>Elizabeth McCaffrey</strong></sub>
    </td>
    <td align="center">
      <a href="https://github.com/mcdonald-josh">
        <img src="https://github.com/mcdonald-josh.png" width="50" />
      </a><br/>
      <sub><strong>Josh McDonald</strong></sub>
    </td>
  </tr>
</table>

