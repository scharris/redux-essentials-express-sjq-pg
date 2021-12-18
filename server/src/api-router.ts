import express from "express";
import {router as postsContextRouter} from "./subjects/posts-context/posts-context-router";
import {router as postsRouter} from "./subjects/posts/posts-router";
import {router as usersRouter} from "./subjects/users/users-router";
import {router as notificationsRouter} from "./subjects/notifications/notifications-router";

export default express.Router()
   .use('/posts', postsRouter)
   .use('/posts-with-context', postsContextRouter)
   .use('/users', usersRouter)
   .use('/notifications', notificationsRouter)
;
