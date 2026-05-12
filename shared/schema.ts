import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("ANALYST"), // BUSINESS_HEAD, ANALYST
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  globalId: text("global_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  city: text("city"),
  accountAge: integer("account_age"), // in days
  customerSince: timestamp("customer_since"),
  riskProfile: text("risk_profile").default("LOW"), // LOW, MEDIUM, HIGH
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alertCode: text("alert_code").notNull().unique(),
  customerId: varchar("customer_id").references(() => customers.id),
  amount: decimal("amount", { precision: 15, scale: 2 }),
  severity: text("severity").notNull(), // HIGH, MEDIUM, LOW
  status: text("status").notNull().default("OPEN"), // OPEN, DISMISSED, SUSPENDED, MARKED_FRAUD
  city: text("city"),
  transactionType: text("transaction_type"),
  channel: text("channel"),
  riskScore: integer("risk_score"),
  aiRecommendation: jsonb("ai_recommendation"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id),
  alertId: varchar("alert_id").references(() => alerts.id),
  amount: decimal("amount", { precision: 15, scale: 2 }),
  channel: text("channel"), // IBFT, Digital App, ATM, POS
  instrumentType: text("instrument_type"), // Credit Card, Debit Card, Bank Transfer
  transactionCategory: text("transaction_category"), // Funds Transfer, Bill Payment, Donations
  riskScore: integer("risk_score"),
  status: text("status").default("NORMAL"), // NORMAL, FLAGGED, BLOCKED
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fraudCases = pgTable("fraud_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alertId: varchar("alert_id").references(() => alerts.id),
  customerId: varchar("customer_id").references(() => customers.id),
  fraudType: text("fraud_type"), // Social Engineering, Account Takeover, SIM Swap
  lossAmount: decimal("loss_amount", { precision: 15, scale: 2 }),
  confirmedBy: varchar("confirmed_by").references(() => users.id),
  investigationNotes: text("investigation_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const investigationNotes = pgTable("investigation_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alertId: varchar("alert_id").references(() => alerts.id),
  userId: varchar("user_id").references(() => users.id),
  note: text("note").notNull(),
  noteType: text("note_type").default("TEXT"), // TEXT, VOICE, SYSTEM
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  alertId: varchar("alert_id").references(() => alerts.id),
  action: text("action").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricDate: timestamp("metric_date").defaultNow(),
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }),
  precision: decimal("precision", { precision: 5, scale: 4 }),
  recall: decimal("recall", { precision: 5, scale: 4 }),
  f1Score: decimal("f1_score", { precision: 5, scale: 4 }),
  totalTransactions: integer("total_transactions"),
  flaggedTransactions: integer("flagged_transactions"),
  confirmedFrauds: integer("confirmed_frauds"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  assignedAlerts: many(alerts),
  investigationNotes: many(investigationNotes),
  auditLogs: many(auditLogs),
  confirmedFrauds: many(fraudCases),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  alerts: many(alerts),
  transactions: many(transactions),
  fraudCases: many(fraudCases),
}));

export const alertsRelations = relations(alerts, ({ one, many }) => ({
  customer: one(customers, {
    fields: [alerts.customerId],
    references: [customers.id],
  }),
  assignedUser: one(users, {
    fields: [alerts.assignedTo],
    references: [users.id],
  }),
  transactions: many(transactions),
  fraudCase: one(fraudCases),
  investigationNotes: many(investigationNotes),
  auditLogs: many(auditLogs),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  customer: one(customers, {
    fields: [transactions.customerId],
    references: [customers.id],
  }),
  alert: one(alerts, {
    fields: [transactions.alertId],
    references: [alerts.id],
  }),
}));

export const fraudCasesRelations = relations(fraudCases, ({ one }) => ({
  alert: one(alerts, {
    fields: [fraudCases.alertId],
    references: [alerts.id],
  }),
  customer: one(customers, {
    fields: [fraudCases.customerId],
    references: [customers.id],
  }),
  confirmedByUser: one(users, {
    fields: [fraudCases.confirmedBy],
    references: [users.id],
  }),
}));

export const investigationNotesRelations = relations(investigationNotes, ({ one }) => ({
  alert: one(alerts, {
    fields: [investigationNotes.alertId],
    references: [alerts.id],
  }),
  user: one(users, {
    fields: [investigationNotes.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
  alert: one(alerts, {
    fields: [auditLogs.alertId],
    references: [alerts.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertFraudCaseSchema = createInsertSchema(fraudCases).omit({
  id: true,
  createdAt: true,
});

export const insertInvestigationNoteSchema = createInsertSchema(investigationNotes).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export const insertSystemMetricsSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  metricDate: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UserPublic = Omit<User, 'password'>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type FraudCase = typeof fraudCases.$inferSelect;
export type InsertFraudCase = z.infer<typeof insertFraudCaseSchema>;
export type InvestigationNote = typeof investigationNotes.$inferSelect;
export type InsertInvestigationNote = z.infer<typeof insertInvestigationNoteSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type SystemMetrics = typeof systemMetrics.$inferSelect;
export type InsertSystemMetrics = z.infer<typeof insertSystemMetricsSchema>;
