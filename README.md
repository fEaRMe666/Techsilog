# Techsilog

Techsilog is a beginner-friendly MEVN blog application where users can register, log in, create blog posts, view posts, update or delete their own posts, and add comments.

Admins can delete any user's post and any user's comment, but they still cannot update another user's post or edit another user's comment.

---

## Test Accounts

### Regular User

```text
Email: tester@mail.com
Password: tester123
```

### Admin User

```text
Email: admin@mail.com
Password: admin123
```

---

## Base URL

For local development:

```text
http://localhost:4000
```

In Postman, you can save this as:

```text
{{baseUrl}}
```

Example:

```text
{{baseUrl}}/posts/getAllPosts
```

---

## Authentication

Protected endpoints require a JWT token.

After logging in, copy the token returned by:

```text
POST {{baseUrl}}/users/login
```

Then add this request header:

```text
Authorization: Bearer <your-token>
```

---

# Current Features

- User registration and login
- JWT authentication
- Password hashing using bcryptjs
- View all available posts
- View a single post
- Create blog posts
- Update your own posts
- Delete your own posts
- Admin can delete any user's post
- Add comments to posts
- Edit your own comments
- Delete your own comments
- Admin can delete any user's comment
- Upvote or downvote posts
- Upvote or downvote comments
- One user cannot repeatedly vote on the same post or comment
- Switching from upvote to downvote removes the previous vote
- Archive and restore your own posts
- Archived posts are hidden from the normal home feed
- Add tags to posts
- Post view counter
- Public user profile showing username, post activity, and comment activity
- Admin-created posts and comments use a yellow/gold visual theme
- Post and comment vote buttons use the same yellow/gold theme

---

# Endpoint Summary

| HTTP Method | Endpoint | Authentication | Description |
|---|---|---|---|
| GET | `/` | No | Check if the API is running |
| POST | `/users/register` | No | Register a user |
| POST | `/users/login` | No | Login and receive JWT |
| GET | `/users/details` | Yes | Get logged-in user details |
| GET | `/users/getUserProfile/:userId` | No | Get a user's profile and activity |
| GET | `/posts/getAllPosts` | No | Get all non-archived blog posts |
| GET | `/posts/getPost/:postId` | No | Get one blog post and increment its views |
| POST | `/posts/addPost` | Yes | Create a blog post |
| PATCH | `/posts/updatePost/:postId` | Yes | Update your own post |
| DELETE | `/posts/deletePost/:postId` | Yes | Delete own post or any post as admin |
| PATCH | `/posts/archivePost/:postId` | Yes | Archive or restore your own post |
| PATCH | `/posts/votePost/:postId` | Yes | Upvote or downvote a post |
| POST | `/posts/addComment/:postId` | Yes | Add a comment to a blog post |
| PATCH | `/posts/updateComment/:postId/:commentId` | Yes | Edit your own comment |
| DELETE | `/posts/deleteComment/:postId/:commentId` | Yes | Delete own comment or any comment as admin |
| PATCH | `/posts/voteComment/:postId/:commentId` | Yes | Upvote or downvote a comment |

---

# API Endpoints

## 1. API Home

### GET

```text
{{baseUrl}}/
```

Authentication:

```text
Not required
```

req.body:

```text
None
```

res.body:

```json
{
  "message": "Techsilog API is running"
}
```

---

# User Endpoints

## 2. Register User

### POST

```text
{{baseUrl}}/users/register
```

Authentication:

```text
Not required
```

req.body:

```json
{
  "email": "newuser@mail.com",
  "username": "newuser",
  "password": "password123"
}
```

res.body:

```json
{
  "message": "Registered Successfully"
}
```

Possible response if the email already exists:

```json
{
  "message": "Email already exists"
}
```

Possible response if the username already exists:

```json
{
  "message": "Username already exists"
}
```

---

## 3. Login User

### POST

```text
{{baseUrl}}/users/login
```

Authentication:

```text
Not required
```

req.body:

```json
{
  "email": "tester@mail.com",
  "password": "tester123"
}
```

res.body:

```json
{
  "access": "<JWT_TOKEN>"
}
```

Example:

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-token"
}
```

Use the returned token on protected endpoints:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## 4. Get Logged-In User Details

### GET

```text
{{baseUrl}}/users/details
```

Authentication:

```text
Required
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body:

```text
None
```

res.body:

```json
{
  "_id": "6a7a8b10b4558ec4207f0f73",
  "email": "tester@mail.com",
  "username": "tester",
  "isAdmin": false,
  "__v": 0
}
```

Admin example:

```json
{
  "_id": "6a7a8b10b4558ec4207f0f74",
  "email": "admin@mail.com",
  "username": "admin",
  "isAdmin": true,
  "__v": 0
}
```

---

## 5. Get User Profile

### GET

```text
{{baseUrl}}/users/getUserProfile/:userId
```

Example:

```text
{{baseUrl}}/users/getUserProfile/6a7a8b10b4558ec4207f0f73
```

Authentication:

```text
Not required
```

req.body:

```text
None
```

res.body:

```json
{
  "user": {
    "_id": "6a7a8b10b4558ec4207f0f73",
    "username": "tester",
    "isAdmin": false
  },
  "posts": [
    {
      "_id": "6a7a8df9b4558ec4207f0f99",
      "title": "Why Authentication Matters",
      "content": "Authentication is important because it helps identify who is using the application.",
      "authorId": "6a7a8b10b4558ec4207f0f73",
      "authorUsername": "tester",
      "authorIsAdmin": false,
      "tags": [
        "JWT",
        "Authentication"
      ],
      "views": 8,
      "isArchived": false,
      "upvotes": [],
      "downvotes": [],
      "comments": [],
      "createdOn": "2026-08-11T02:50:33.616Z",
      "__v": 0
    }
  ],
  "comments": [
    {
      "postId": "6a7a8df9b4558ec4207f0f98",
      "postTitle": "My Experience Using Vue",
      "commentId": "6a7a9010b4558ec4207f0fa1",
      "comment": "Vue Router became easier to understand after using it in this project.",
      "createdOn": "2026-08-11T03:10:21.500Z",
      "updatedOn": null
    }
  ]
}
```

---

# Post Endpoints

## 6. Get All Posts

### GET

```text
{{baseUrl}}/posts/getAllPosts
```

Authentication:

```text
Not required
```

req.body:

```text
None
```

Notes:

```text
Archived posts are not included in the normal post list.
Posts are currently sorted by creation date, newest first.
```

res.body:

```json
[
  {
    "_id": "6a7a8df9b4558ec4207f0f99",
    "title": "Why Authentication Matters",
    "content": "Authentication is important because it helps identify who is using the application. In Techsilog, JWT tokens are used so the server can recognize logged-in users and control who can create, edit, delete, and comment on posts.",
    "authorId": "6a7a8b10b4558ec4207f0f73",
    "authorUsername": "tester",
    "authorIsAdmin": false,
    "tags": [
      "JWT",
      "Authentication"
    ],
    "views": 8,
    "isArchived": false,
    "upvotes": [
      "6a7a8b10b4558ec4207f0f74"
    ],
    "downvotes": [],
    "createdOn": "2026-08-11T02:50:33.616Z",
    "comments": [],
    "__v": 1
  }
]
```

---

## 7. Get Single Post

### GET

```text
{{baseUrl}}/posts/getPost/:postId
```

Example:

```text
{{baseUrl}}/posts/getPost/6a7a8df9b4558ec4207f0f99
```

Authentication:

```text
Not required
```

req.body:

```text
None
```

Notes:

```text
Opening a single post currently increases its view count.
```

res.body:

```json
{
  "_id": "6a7a8df9b4558ec4207f0f99",
  "title": "Why Authentication Matters",
  "content": "Authentication is important because it helps identify who is using the application.",
  "authorId": "6a7a8b10b4558ec4207f0f73",
  "authorUsername": "tester",
  "authorIsAdmin": false,
  "tags": [
    "JWT",
    "Authentication"
  ],
  "views": 9,
  "isArchived": false,
  "upvotes": [
    "6a7a8b10b4558ec4207f0f74"
  ],
  "downvotes": [],
  "createdOn": "2026-08-11T02:50:33.616Z",
  "comments": [],
  "__v": 2
}
```

If the post does not exist:

```json
{
  "message": "Post not found"
}
```

---

## 8. Add Post

### POST

```text
{{baseUrl}}/posts/addPost
```

Authentication:

```text
Required
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body:

```json
{
  "title": "Why Authentication Matters",
  "content": "Authentication is important because it helps identify who is using the application. In Techsilog, JWT tokens are used so the server can recognize logged-in users and control who can create, edit, delete, and comment on posts.",
  "tags": [
    "JWT",
    "Authentication",
    "Backend"
  ]
}
```

res.body:

```json
{
  "message": "Post created successfully",
  "post": {
    "title": "Why Authentication Matters",
    "content": "Authentication is important because it helps identify who is using the application. In Techsilog, JWT tokens are used so the server can recognize logged-in users and control who can create, edit, delete, and comment on posts.",
    "authorId": "6a7a8b10b4558ec4207f0f73",
    "authorUsername": "tester",
    "authorIsAdmin": false,
    "tags": [
      "JWT",
      "Authentication",
      "Backend"
    ],
    "views": 0,
    "isArchived": false,
    "upvotes": [],
    "downvotes": [],
    "_id": "6a7a8df9b4558ec4207f0f99",
    "createdOn": "2026-08-11T02:50:33.616Z",
    "comments": [],
    "__v": 0
  }
}
```

If the author is an admin, `authorIsAdmin` is saved as `true`. The client uses this value to display the yellow/gold admin card theme.

---

## 9. Update Own Post

### PATCH

```text
{{baseUrl}}/posts/updatePost/:postId
```

Example:

```text
{{baseUrl}}/posts/updatePost/6a7a8df9b4558ec4207f0f99
```

Authentication:

```text
Required
```

Important:

```text
Only the user who created the post can update it.
Admins cannot update another user's post.
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body:

```json
{
  "title": "Why Authentication Is Important",
  "content": "Authentication allows the server to identify logged-in users and protect actions that should only be available to authorized accounts.",
  "tags": [
    "JWT",
    "Security"
  ]
}
```

res.body:

```json
{
  "message": "Post updated successfully",
  "post": {
    "_id": "6a7a8df9b4558ec4207f0f99",
    "title": "Why Authentication Is Important",
    "content": "Authentication allows the server to identify logged-in users and protect actions that should only be available to authorized accounts.",
    "authorId": "6a7a8b10b4558ec4207f0f73",
    "authorUsername": "tester",
    "authorIsAdmin": false,
    "tags": [
      "JWT",
      "Security"
    ],
    "views": 9,
    "isArchived": false,
    "upvotes": [],
    "downvotes": [],
    "createdOn": "2026-08-11T02:50:33.616Z",
    "comments": [],
    "__v": 3
  }
}
```

If another user tries to update the post:

```json
{
  "message": "You can only update your own post"
}
```

---

## 10. Delete Post

### DELETE

```text
{{baseUrl}}/posts/deletePost/:postId
```

Example:

```text
{{baseUrl}}/posts/deletePost/6a7a8df9b4558ec4207f0f99
```

Authentication:

```text
Required
```

Permissions:

```text
Regular User:
- Can delete their own post.
- Cannot delete another user's post.

Admin:
- Can delete any user's post.
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body:

```text
None
```

res.body:

```json
{
  "message": "Post deleted successfully"
}
```

If a regular user tries to delete another user's post:

```json
{
  "message": "You can only delete your own post"
}
```

---

## 11. Archive or Restore Own Post

### PATCH

```text
{{baseUrl}}/posts/archivePost/:postId
```

Example:

```text
{{baseUrl}}/posts/archivePost/6a7a8df9b4558ec4207f0f99
```

Authentication:

```text
Required
```

Important:

```text
Only the creator of the post can archive or restore it.
Calling the endpoint toggles the current archived state.
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body:

```text
None
```

res.body when archiving:

```json
{
  "message": "Post archived successfully",
  "post": {
    "_id": "6a7a8df9b4558ec4207f0f99",
    "title": "Why Authentication Matters",
    "isArchived": true
  }
}
```

res.body when restoring:

```json
{
  "message": "Post restored successfully",
  "post": {
    "_id": "6a7a8df9b4558ec4207f0f99",
    "title": "Why Authentication Matters",
    "isArchived": false
  }
}
```

If another user tries to archive it:

```json
{
  "message": "You can only archive your own post"
}
```

---

## 12. Upvote or Downvote a Post

### PATCH

```text
{{baseUrl}}/posts/votePost/:postId
```

Example:

```text
{{baseUrl}}/posts/votePost/6a7a8df9b4558ec4207f0f99
```

Authentication:

```text
Required
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body for upvote:

```json
{
  "vote": "up"
}
```

req.body for downvote:

```json
{
  "vote": "down"
}
```

res.body:

```json
{
  "message": "Vote updated successfully",
  "upvotes": [
    "6a7a8b10b4558ec4207f0f73"
  ],
  "downvotes": []
}
```

Voting behavior:

```text
No vote + Upvote      = Upvoted
Upvote + Upvote       = Vote removed
Upvote + Downvote     = Upvote removed and Downvote added
Downvote + Downvote   = Vote removed
Downvote + Upvote     = Downvote removed and Upvote added
```

---

# Comment Endpoints

## 13. Add Comment to Post

### POST

```text
{{baseUrl}}/posts/addComment/:postId
```

Example:

```text
{{baseUrl}}/posts/addComment/6a7a8df9b4558ec4207f0f99
```

Authentication:

```text
Required
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body:

```json
{
  "comment": "This is a helpful post. Authentication became easier to understand after building a JWT project."
}
```

res.body:

```json
{
  "message": "Comment added successfully",
  "post": {
    "_id": "6a7a8df9b4558ec4207f0f99",
    "title": "Why Authentication Matters",
    "comments": [
      {
        "userId": "6a7a8b10b4558ec4207f0f74",
        "username": "admin",
        "comment": "This is a helpful post. Authentication became easier to understand after building a JWT project.",
        "isAdmin": true,
        "upvotes": [],
        "downvotes": [],
        "_id": "6a7a9010b4558ec4207f0fa1",
        "createdOn": "2026-08-11T03:10:21.500Z",
        "updatedOn": null
      }
    ]
  }
}
```

Admin comments save `isAdmin: true`, which lets the client display the yellow/gold admin comment style.

---

## 14. Update Own Comment

### PATCH

```text
{{baseUrl}}/posts/updateComment/:postId/:commentId
```

Example:

```text
{{baseUrl}}/posts/updateComment/6a7a8df9b4558ec4207f0f99/6a7a9010b4558ec4207f0fa1
```

Authentication:

```text
Required
```

Important:

```text
Users can edit only comments they created.
Admin status does not allow editing another user's comment.
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body:

```json
{
  "comment": "Updated comment: JWT authentication became easier after building Techsilog."
}
```

res.body:

```json
{
  "message": "Comment updated successfully",
  "post": {
    "_id": "6a7a8df9b4558ec4207f0f99",
    "comments": [
      {
        "_id": "6a7a9010b4558ec4207f0fa1",
        "userId": "6a7a8b10b4558ec4207f0f73",
        "username": "tester",
        "comment": "Updated comment: JWT authentication became easier after building Techsilog.",
        "isAdmin": false,
        "upvotes": [],
        "downvotes": [],
        "createdOn": "2026-08-11T03:10:21.500Z",
        "updatedOn": "2026-08-11T04:05:00.000Z"
      }
    ]
  }
}
```

If another user tries to edit the comment:

```json
{
  "message": "You can only update your own comment"
}
```

---

## 15. Delete Comment

### DELETE

```text
{{baseUrl}}/posts/deleteComment/:postId/:commentId
```

Example:

```text
{{baseUrl}}/posts/deleteComment/6a7a8df9b4558ec4207f0f99/6a7a9010b4558ec4207f0fa1
```

Authentication:

```text
Required
```

Permissions:

```text
Regular User:
- Can delete their own comment.
- Cannot delete another user's comment.

Admin:
- Can delete any user's comment.
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body:

```text
None
```

res.body:

```json
{
  "message": "Comment deleted successfully",
  "post": {
    "_id": "6a7a8df9b4558ec4207f0f99",
    "comments": []
  }
}
```

If a regular user tries to delete another user's comment:

```json
{
  "message": "You can only delete your own comment"
}
```

---

## 16. Upvote or Downvote a Comment

### PATCH

```text
{{baseUrl}}/posts/voteComment/:postId/:commentId
```

Example:

```text
{{baseUrl}}/posts/voteComment/6a7a8df9b4558ec4207f0f99/6a7a9010b4558ec4207f0fa1
```

Authentication:

```text
Required
```

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

req.body for upvote:

```json
{
  "vote": "up"
}
```

req.body for downvote:

```json
{
  "vote": "down"
}
```

res.body:

```json
{
  "message": "Comment vote updated successfully",
  "upvotes": [
    "6a7a8b10b4558ec4207f0f73"
  ],
  "downvotes": []
}
```

Comment voting follows the same toggle and vote-switching behavior as post voting.

---

# User Permissions

## Guest

A guest can:

- View all non-archived posts
- View a single post
- View a user's public profile and activity
- Register
- Login

## Logged-In User

A logged-in user can:

- View all posts available on the normal feed
- View a single post
- View user profiles
- Create a post
- Add tags to their post
- Update their own post
- Delete their own post
- Archive or restore their own post
- Upvote or downvote posts
- Comment on posts
- Edit their own comments
- Delete their own comments
- Upvote or downvote comments

A normal user cannot:

- Update another user's post
- Delete another user's post
- Archive another user's post
- Edit another user's comment
- Delete another user's comment

## Admin

An admin can:

- Perform normal logged-in user actions
- Delete any user's post
- Delete any user's comment
- Create posts and comments that display with the yellow/gold admin theme

An admin still cannot:

- Update another user's post
- Archive another user's post
- Edit another user's comment

---

# Tech Stack

## Server

- Node.js
- Express
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token
- CORS
- dotenv

## Client

- Vue 3
- Vue Router
- Pinia
- Axios
- Bootstrap 5
- Bootstrap Icons
- Notyf
- Vite

---

# Possible Future Improvements

Techsilog is still a prototype and can be improved further. Possible next features include:

- **Replies to comments**  
  Allow users to reply directly to another comment, creating simple comment threads.

- **Overall / net vote score**  
  Display a single score between the Upvote and Downvote buttons for posts and comments, such as `upvotes - downvotes`.

- **Sort the home feed by recent interaction**  
  Instead of using only the post creation date, posts could move upward when they receive a new comment, vote, edit, or other interaction.

- **Admin pinned posts**  
  Allow admins to pin important announcements or featured posts so they always appear at the top of the home page.

- **Sort and filter posts by tags**  
  Users could click a tag to view related posts.

- **Post search**  
  Search posts using title, author, content, or tags.

- **Most discussed / most voted sections**  
  Show posts with the highest comment activity or vote activity.

- **Track the latest activity date**  
  Store a simple `lastActivityOn` field so the server can easily determine which post had the most recent interaction.

- **Better archived-post management**  
  Add a dedicated page where users can view and restore all of their archived posts.

- **Basic moderation tools**  
  Admins could eventually pin, unpin, archive, or hide inappropriate posts without permanently deleting them.

These are not required for the current beginner prototype, but they are possible directions for a future version of Techsilog.

---

# Project Name

**Techsilog**

Beginner MEVN Blog Application Prototype.
