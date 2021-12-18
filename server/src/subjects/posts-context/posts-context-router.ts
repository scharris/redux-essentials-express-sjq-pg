import express, { Request, Response } from "express";
import { PostsWithContext } from "../../../../client/src/data-transfer";
import * as PostsContextService from "./posts-context-service";

export const router = express.Router();

router.get("/", async (_req: Request, res: Response) =>
{
   try
   {
      const postsWithContext: PostsWithContext = await PostsContextService.getPostsWithContext();

      res.status(200).send(postsWithContext);
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message || 'unexpected error occured in GET of application base data');
   }
});
