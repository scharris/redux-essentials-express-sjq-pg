import express, { Request, Response } from "express";
import { ZodError } from 'zod';
import * as PostsService from "./posts-service";
import {
   CreatePostData,
   CreateReactionData,
   CreateReactionDataSchema,
   Post,
   CreatePostDataSchema,
   UpdatePostData,
   UpdatePostDataSchema,
} from '../../../../client/src/data-transfer';

export const router = express.Router();

router.get("/", async (_req: Request, res: Response) =>
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
      res.status(400).send({ message: 'invalid post id' });
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


router.post("/", async (req: Request, res: Response) =>
{
   try
   {
      const newPostData: CreatePostData = CreatePostDataSchema.parse(req.body);

      const createdPostData = await PostsService.createPost(newPostData);

      res.status(201).send(createdPostData);
   }
   catch (e: any)
   {
      if (e instanceof ZodError)
         res.status(400)
            .send('Request body is invalid.');
      else
         res.status(500)
            .send(e.message || `unexpected error occurred in creating new post from data: ${req.body}`);
   }
});

router.patch("/:id", async (req: Request, res: Response) =>
{
   try
   {
      const postId = parseInt(req.params.id, 10);
      if ( isNaN(postId) )
      {
         res.status(400).send({message: 'invalid post id'});
         return;
      }

      const postData: UpdatePostData = UpdatePostDataSchema.parse(req.body);

      await PostsService.updatePost(postId, postData);

      res.sendStatus(200);
   }
   catch(e: any)
   {
      if (e instanceof ZodError)
         res.status(400)
            .send('Request body is invalid.');
      else
         res.status(500)
            .send(e.message || `unexpected error occurred in PUT of post data: ${req.body}`);
   }
});

router.put("/:id/reaction", async (req: Request, res: Response) =>
{
   const postId = parseInt(req.params.id, 10);
   if ( isNaN(postId) )
   {
      res.status(400).send({message: 'invalid post id'});
      return;
   }

   try
   {
      const reactionData: CreateReactionData = CreateReactionDataSchema.parse(req.body);

      const added = await PostsService.addReaction(postId, reactionData);

      res.status(200).send({ added });
   }
   catch (e: any)
   {
      if (e instanceof ZodError)
         res.status(400)
            .send('Request body is invalid.');
      else
         res.status(500)
            .send(e.message  || `unexpected error occurred in GET of post with id ${postId}`);
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
