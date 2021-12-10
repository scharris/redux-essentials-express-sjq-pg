import express, { Request, Response } from "express";
import { Notification } from '../../../../client/src/data-transfer';
import * as NotificationsService from "./notifications-service";

export const router = express.Router();

router.get("/", async (req: Request, res: Response) =>
{
   try
   {
      const notfns: Notification[] = await NotificationsService.getNotifications();

      res.status(200).send(notfns);
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message || 'unexpected error occured in GET of notifications list');
   }
});
