import express, { Request, Response } from "express";
import { User } from '../../../../client/src/data-transfer';
import * as UsersService from "./users-service";

export const router = express.Router();

router.get("/", async (req: Request, res: Response) =>
{
   try
   {
      const users: User[] = await UsersService.getUsers();

      res.status(200).send(users);
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message || 'unexpected error occured in GET of users list');
   }
});
