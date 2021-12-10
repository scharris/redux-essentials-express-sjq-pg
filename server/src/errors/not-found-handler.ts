import {Request, Response, NextFunction} from "express";

export function notFoundHandler
   (
      request: Request,
      response: Response,
      next: NextFunction
   )
{
   response.status(404).send("Resource not found");
}
