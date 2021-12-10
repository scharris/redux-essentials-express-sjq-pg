import express, { Request, Response } from "express";
import * as InitialDataService from "./initial-data-service";

export const router = express.Router();

router.get("/", async (req: Request, res: Response) =>
{
   try
   {
      const initialData = await InitialDataService.getInitialData();

      res.status(200).send(initialData);
   }
   catch (e: any)
   {
      res.status(500)
         .send(e.message || 'unexpected error occured in GET of initial data');
   }
});
