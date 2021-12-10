import {NextFunction, Request, Response} from "express";
import {HttpException} from './http-exception';

export function httpErrorHandler
   (
      error: HttpException,
      request: Request,
      response: Response,
      _next: NextFunction
   ): void
{
   const status = error.statusCode || 500;
   const message = error.message || "internal server error";

   response.status(status).send(message);
}
