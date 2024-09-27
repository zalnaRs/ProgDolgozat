import { Elysia, redirect, t } from "elysia";
import { Session, User } from "lucia";
import { problemTable, userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db";
import Root from "../components/root";
import ProblemsList from "../components/problems-list";

export const adminGroup = new Elysia({ prefix: "/admin" }).guard(
  {
    async beforeHandle({ user }: { user: User | null }) {
      if (
        (
          await db
            .select()
            .from(userTable)
            .where(eq(userTable.id, user?.id ?? ""))
        )[0].permission !== 1
      )
        return new Response("?", {
          status: 401,
          headers: { location: "/auth/signout" },
        });
    },
  },
  (app) =>
    app
      .get(
        "/",
        async ({
          user,
          session,
        }: {
          user: User | null;
          session: Session | null;
        }) => {
          if (
            (
              await db
                .select()
                .from(userTable)
                .where(eq(userTable.id, user?.id ?? ""))
            )[0].permission !== 1
          )
            return redirect("/auth/signout");

          return (
            <Root session={session}>
              <main>
                <a href={"/admin/problem"}>Probléma létrehozása</a>
                <ProblemsList
                  problems={await db.select().from(problemTable)}
                  isAdmin
                />
              </main>
            </Root>
          );
        },
      )
      .get("/problem", ({ session }: { session: Session | null }) => (
        <Root session={session}>
          <main>
            <form method="POST" className="center">
              <input type="text" name="title" placeholder="Név" />
              <textarea name="description" placeholder="Leírás (markdown)" />
              <input type={"submit"} value={"Létrehozás"} />
            </form>
          </main>
        </Root>
      ))
      .post(
        "/problem",
        async ({ body }) => {
          await db.insert(problemTable).values({ ...body });

          return redirect("/admin");
        },
        {
          body: t.Object({ title: t.String(), description: t.String() }),
        },
      ),
);
