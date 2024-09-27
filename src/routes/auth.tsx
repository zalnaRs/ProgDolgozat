import { Elysia, redirect, t } from "elysia";
import Root from "../components/root";
import { db } from "../db";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { lucia } from "../auth";
import { Session } from "lucia";

export const authGroup = new Elysia({ prefix: "/auth" })
  .get("/", ({ session }: { session: Session | null }) => (
    <Root session={session}>
      <form method="POST" action="/auth" class={"center"}>
        <input type={"text"} name={"id"} placeholder={"Azonositó"} />
        <input type={"password"} name={"password"} placeholder={"Jelszó"} />
        <input type={"submit"} value={"Bejelenkezés"} />
      </form>
    </Root>
  ))
  .post(
    "/",
    async ({ body: { id, password } }) => {
      try {
        const existingUser = await db
          .select()
          .from(userTable)
          .where(eq(userTable.id, id));

        if (!existingUser || existingUser.length === 0)
          return new Response("Hibás azonositó!", { status: 401 });

        const validPassword = await Bun.password.verify(
          password,
          existingUser[0].password_hash,
        );
        if (!validPassword)
          return new Response("Hibás azonositó!", { status: 401 });

        const session = await lucia.createSession(existingUser[0].id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": sessionCookie.serialize(),
          },
        });
      } catch (e) {
        return new Response("Hiba! " + e, { status: 500 });
      }
    },
    {
      body: t.Object({
        id: t.String(),
        password: t.String(),
      }),
    },
  )
  .get("/signout", async ({ session }: { session: Session | null }) => {
    if (!session) return redirect("/");
    await lucia.invalidateSession(session.id);

    return redirect("/");
  });
