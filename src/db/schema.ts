import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const userTable = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  password_hash: text("password_hash").notNull(),
  permission: integer("permission"),
});

export const userTableRelations = relations(userTable, ({ many }) => ({
  answers: many(answerTable),
}));

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const problemTable = sqliteTable("problem", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
});

export const problemTableRelations = relations(problemTable, ({ many }) => ({
  answers: many(answerTable),
}));

export const answerTable = sqliteTable("answer", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  userId: text("user_id"),
  problemId: integer("problem_id"),
});

export const answerTableRelations = relations(answerTable, ({ one }) => ({
  user: one(userTable, {
    fields: [answerTable.userId],
    references: [userTable.id],
  }),
  problem: one(problemTable, {
    fields: [answerTable.problemId],
    references: [problemTable.id],
  }),
}));
