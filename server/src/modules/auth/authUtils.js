import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../../config/constants.js";
import prisma from "../../config/prismaClient.js";

async function createToken(data, secret, expiry, type) {
  const token = jwt.sign(data, secret, { expiresIn: expiry });
  await prisma.token.create({
    data: {
      token: token,
      type: type,
      userId: data.id,
    },
  });
  return token;
}

export { createToken };
