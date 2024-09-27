import { Session } from "lucia";

export default function Root({
  children,
  session,
}: {
  children: JSX.Element;
  session: Session | null;
}) {
  return (
    <>
      {"<!doctype html>"}
      <html lang="hu">
        <head>
          <script src="/mini-coi.js"></script>
          <title>Programozás Dolgozat</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="charset" content="UTF-8" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="/styles.css" />
        </head>
        <body>
          {session && (
            <nav>
              <a href="/">
                <h1>Programozás Dolgozat</h1>
              </a>

              <ul>
                <li>
                  <a href="/problems">Problémák</a>
                </li>

                <li>
                  <a href="/auth/signout">Kijelenkezés</a>
                </li>
              </ul>
            </nav>
          )}
          {!session && (
            <script
              defer
            >{`if (location.pathname !== '/auth') {location.pathname='/auth'}`}</script>
          )}
          <div id="root">{children}</div>
        </body>
      </html>
    </>
  );
}
