import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const portfolioContent = sqliteTable("portfolio_content", {
  id: text("id").primaryKey(),
  data: text("data", { mode: "json" }).notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const tickets = sqliteTable(
  "tickets",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [index("idx_tickets_created_at").on(table.createdAt)],
);

export const cvFiles = sqliteTable("cv_files", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  objectKey: text("object_key").notNull(),
  uploadedAt: integer("uploaded_at").notNull(),
});

export const askQuestions = sqliteTable(
  "ask_questions",
  {
    id: text("id").primaryKey(),
    question: text("question").notNull(),
    answer: text("answer").notNull().default(""),
    status: text("status").notNull().default("new"),
    showOnAsk: integer("show_on_ask", { mode: "boolean" }).notNull().default(false),
    showOnProfile: integer("show_on_profile", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
    answeredAt: integer("answered_at"),
  },
  (table) => [
    index("idx_ask_questions_created_at").on(table.createdAt),
    index("idx_ask_questions_show_on_ask").on(table.showOnAsk),
    index("idx_ask_questions_show_on_profile").on(table.showOnProfile),
  ],
);

export const askShareImages = sqliteTable("ask_share_images", {
  id: text("id").primaryKey(),
  revision: integer("revision").notNull(),
  image: text("image").notNull(),
});
