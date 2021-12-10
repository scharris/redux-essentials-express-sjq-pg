import express, { Request, Response } from "express";
import * as PostsService from "./posts-service";
import { NewPostData, NewReactionData, Post, UpdatedPostData} from '../../../../client/src/data-transfer';

export const router = express.Router();

router.get("/", async (req: Request, res: Response) =>
{
   try
   {
      const posts: Post[] = await PostsService.getPosts();

      res.status(200).send(posts);
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message || 'unexpected error occured in GET of posts list');
   }
});

router.get("/:id", async (req: Request, res: Response) =>
{
   const id = parseInt(req.params.id, 10);

   if ( isNaN(id) )
   {
      res.status(400).send({message: 'invalid post id'});
      return;
   }

   try
   {
      const post: Post | null = await PostsService.getPost(id);

      if ( post == null )
         res.sendStatus(404);
      else
         res.status(200).send(post);
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message  || `unexpected error occurred in GET of post with id ${id}`);
   }
});

router.post("/:id/reaction", async (req: Request, res: Response) =>
{
   const id = parseInt(req.params.id, 10);

   if ( isNaN(id) )
   {
      res.status(400).send({message: 'invalid post id'});
      return;
   }

   try
   {
      const reactionData: NewReactionData = req.body;

      const added = await PostsService.addReaction(reactionData);

      res.status(200).send({ added });
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message  || `unexpected error occurred in GET of post with id ${id}`);
   }
});

router.post("/", async (req: Request, res: Response) =>
{
   try
   {
      const postData: NewPostData = req.body;

      const createdPostData = await PostsService.createPost(postData);

      res.status(201).send(createdPostData);
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message || `unexpected error occurred in creating new post from data: ${req.body}`);
   }
});

router.put("/:id", async (req: Request, res: Response) =>
{
   try
   {
      const id = parseInt(req.params.id, 10);

      if ( isNaN(id) )
      {
         res.status(400).send({message: 'invalid post id'});
         return;
      }

      const postData: UpdatedPostData = req.body;

      await PostsService.updatePost(id, postData);

      res.sendStatus(200);
   }
   catch(e: any)
   {
      res.status(500)
         .send(e.message || `unexpected error occurred in PUT of post data: ${req.body}`);
   }
});

router.delete("/:id", async (req: Request, res: Response) =>
{
   try
   {
      const id = parseInt(req.params.id, 10);

      if ( isNaN(id) )
      {
         res.status(400).send({message: 'invalid post id'});
         return;
      }

      await PostsService.removePost(id);

      res.sendStatus(200);
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message  || `unexpected error occurred in DELETE of post with id ${req.params.id}`);
   }
});
