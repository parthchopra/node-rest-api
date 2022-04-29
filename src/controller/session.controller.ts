import config from "config";
import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import logger from "../utils/logger";

export async function createUserSessionHandler(req: Request, res: Response) {
  try {
    const user = await validatePassword(req.body);
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const session = await createSession(user._id, req.get("user-agent") || "");
    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get<string>("accessTokenTtl") }
    );

    const refreshToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get<string>("refreshTokenTtl") }
    );

    res.send({ accessToken, refreshToken });
  } catch (error: any) {
    logger.error(error);
    return res.status(400).send(JSON.stringify(error));
  }
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user?._id;
  logger.info(`user id from controller ${userId}`);

  if (!userId) {
    res.sendStatus(400);
  } else {
    const sessions = await findSessions({ user: userId, valid: true });
    res.send(sessions);
  }
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user?.session;

  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
