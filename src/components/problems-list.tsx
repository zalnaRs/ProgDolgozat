import { answerTable, problemTable } from "../db/schema";

export default function ProblemsList({
  problems,
  answers,
  isAdmin,
}: {
  problems: (typeof problemTable.$inferSelect)[];
  answers?: (typeof answerTable.$inferSelect)[];
  isAdmin?: boolean;
}) {
  return (
    <table>
      <tr>
        <th></th>
        <th>Név</th>
        <th>Állapot</th>
      </tr>
      {problems.map((problem, i) => (
        <tr key={problem.id}>
          <th>{i + 1}</th>
          <td>
            <a href={`/problems/${problem.id}`}>{problem.title}</a>
          </td>
          {!isAdmin && (
            <td>
              {answers?.filter((v) => v.problemId === problem.id)[0]
                ? "Kész"
                : "Nincs elkezdve"}
            </td>
          )}
        </tr>
      ))}
    </table>
  );
}
