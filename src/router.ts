import { Router } from "express";
import { authScheme } from "./auth/scheme";
import { authUseCase } from "./auth/authUseCase";
import { requestBodyLayer } from "./service/zod/requestBodyLayer";

export const createRouter = () => {
  const router = Router();

  router.post(
    "/auth",
    requestBodyLayer(authScheme, (req, res) => {
      const result = authUseCase(req, res); //正常に終了したらJWTを返す
      return result;
    })
  );

  return router;
};
