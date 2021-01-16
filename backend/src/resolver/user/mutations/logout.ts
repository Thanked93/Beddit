import { Response } from "express";
import { COOKIE_NAME } from "../../../constants";
import { Req } from "../../../types";

export function logout(res: Response, req: Req) {
  return new Promise((resolve) =>
    req.session.destroy((err) => {
      res.clearCookie(COOKIE_NAME);
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    })
  );
}
