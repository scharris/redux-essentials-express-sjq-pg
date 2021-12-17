import express, { Request, Response } from "express";
import * as NotificationsService from "./notifications-service";

export const router = express.Router();

router.get("/", async (req: Request, res: Response) =>
{
   try
   {
      const notifications = await NotificationsService.getNotifications();

      res.status(200).send(notifications);
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message || 'unexpected error occured in GET of notifications list');
   }
});
