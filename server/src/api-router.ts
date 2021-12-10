import express from "express";
import {router as initialDataRouter} from "./subjects/initial-data/initial-data-router";
import {router as postsRouter} from "./subjects/posts/posts-router";
import {router as usersRouter} from "./subjects/users/users-router";
import {router as notificationsRouter} from "./subjects/notifications/notifications-router";

export default express.Router()
   .use('/initial-data', initialDataRouter)
   .use('/posts', postsRouter)
   .use('/users', usersRouter)
   .use('/notifications', notificationsRouter)
;
