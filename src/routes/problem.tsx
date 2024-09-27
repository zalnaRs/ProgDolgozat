import { Elysia } from "elysia";
import Root from "../components/root";
import { Session, User } from "lucia";
import { db } from "../db";
import { answerTable, problemTable } from "../db/schema";
import ProblemsList from "../components/problems-list";
import { eq } from "drizzle-orm";
import { marked } from "marked";
import { authContext } from "../auth";

export const problemGroup = new Elysia({ prefix: "/problems" })
  .derive(authContext)
  .get("/", async ({ user, session }) => (
    <Root session={session}>
      <ProblemsList
        problems={await db.select().from(problemTable)}
        answers={await db
          .select()
          .from(answerTable)
          .where(eq(answerTable.userId, user?.id ?? ""))}
      />
    </Root>
  ))
  .get("/:id", async ({ user, session, params: { id }, set }) => {
    const problem = await db
      .select()
      .from(problemTable)
      .where(eq(problemTable.id, parseInt(id)));

    return (
      <Root session={session}>
        <main id="editor_main">
          <link
            rel="stylesheet"
            href="https://pyscript.net/releases/2024.9.1/core.css"
          />
          <script
            type="module"
            src="https://pyscript.net/releases/2024.9.1/core.js"
            defer
          ></script>

          <section>
            <section>
              <h1>{problem[0].title}</h1>
              <p>{marked.parse(problem[0].description)}</p>
            </section>
            <section>
              <button id="play_btn">Futtatás</button>
              <button id="submit_btn">
                Beküldés <strong>MÁSKÉPPEN NEM ÉRVÉNYES</strong>
              </button>

              <script
                id="terminal"
                type="mpy"
                terminal
              >{`print('Hello, World!')`}</script>
            </section>
          </section>
          <section style={{ display: "flex" }}>
            <div id="editor_container"></div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.51.0/min/vs/loader.min.js"></script>
            <script>
              {`require.config({paths: {vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.51.0/min/vs'}});
                require(['vs/editor/editor.main'], function () {
                    let editor = monaco.editor.create(document.getElementById('editor_container'), {
                        value: "print('Hello, World!')",
                        language: 'python',
                        automaticLayout: true
                    });
                    
                    const terminal = document.querySelector('#terminal');
                    const playButton = document.querySelector('#play_btn');
                    playButton.onclick = () => {
                    alert(editor.getValue())
                    console.log(terminal)
                    const x = editor.getValue()
                        terminal.process('print("Hello, World! 2")')
                    }
                })`}
            </script>
          </section>
        </main>
      </Root>
    );
  });
