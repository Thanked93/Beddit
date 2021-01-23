import { Request, Response } from "express";
import session from "express-session";
import { Redis } from "ioredis";
import { createVoteLoader } from "./utils/createVoteLoader";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
  req: Req;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  voteLoader: ReturnType<typeof createVoteLoader>;
};

export type Req = Request & { session: session.Session & { userId?: number } };
