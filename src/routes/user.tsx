import { Elysia, t } from "elysia";
import { userTable } from "../db/schema";
import { db } from "../db";
import { generateIdFromEntropySize } from "lucia";

export const userGroup = new Elysia({ prefix: "/user" })
  .get("/", () => db.select().from(userTable).all())
  .post(
    "/",
    async ({ body: { name, password, permission } }) => {
      const _permission = parseInt(permission);
      // @ts-ignore
      if (_permission !== 0 || _permission !== 1)
        throw new Error("Bad Request");
      db.insert(userTable).values({
        name,
        password_hash: await Bun.password.hash(password),
        id: generateIdFromEntropySize(10),
        permission: _permission,
      });
    },
    {
      body: t.Object({
        name: t.String(),
        password: t.String(),
        permission: t.String(),
      }),
    },
  );
