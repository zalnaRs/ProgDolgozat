import { Elysia, redirect } from "elysia";
import { cors } from "@elysiajs/cors";
import { html, Html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { authGroup } from "./routes/auth";
import { userGroup } from "./routes/user";
import Root from "./components/root";
import { authContext, lucia } from "./auth";
import { Session, User, verifyRequestOrigin } from "lucia";
import { problemGroup } from "./routes/problem";
import { adminGroup } from "./routes/admin";

const app = new Elysia({
  serve: {
    tls: {
      cert: Bun.file("cert.pem"),
      key: Bun.file("key.pem"),
    },
  },
})
  .use(cors())
  .use(html())
  .use(staticPlugin({ prefix: "/" }))
  .guard(
    {
      afterHandle: ({ set }) => {
        set.headers["Access-Control-Allow-Origin"] = "*";
        set.headers["Cross-Origin-Opener-Policy"] = "same-origin";
        set.headers["Cross-Origin-Embedder-Policy"] = "require-corop";
        set.headers["Cross-Origin-Resource-Policy"] = "cross-origin";
      },
    },
    (app) =>
      app
        .derive(authContext)
        .get("/", ({ session, user }) => {
          if (!session) return redirect("/auth");
          else return redirect("/problems");
        })
        .get("/status", async ({ user, session }) => {
          return (
            <Root session={session}>
              <h1>Hello, World!</h1>
              <pre>{JSON.stringify(user)}</pre>
              <pre>{JSON.stringify(session)}</pre>
            </Root>
          );
        })
        .use(authGroup)
        .use(userGroup)
        .use(problemGroup)
        .use(adminGroup),
  );

app.listen(process.env.PORT as string, () =>
  console.log(`🦊 Server started at ${app.server?.url.origin}`),
);
