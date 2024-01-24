import express from "express";
import { z } from "zod";

export const requestBodyLayer =
  <Tbody>(
    schema: z.Schema<Tbody>,
    callback: (
      req: express.Request<any, any, Tbody, any>,
      res: express.Response
    ) => void
  ) =>
  (req: express.Request, res: express.Response) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log(result.error.issues[0]);
      return res.status(400).send(result.error.issues[0].message);
    }

    return callback(req, res);
  };
