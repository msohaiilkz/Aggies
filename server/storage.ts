import { 
  users, customers, alerts, transactions, fraudCases, 
  investigationNotes, auditLogs, systemMetrics,
  type User, type InsertUser, type Customer, type InsertCustomer,
  type Alert, type InsertAlert, type Transaction, type InsertTransaction,
  type FraudCase, type InsertFraudCase, type InvestigationNote, type InsertInvestigationNote,
  type AuditLog, type InsertAuditLog, type SystemMetrics, type InsertSystemMetrics
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gte, lte, count, like, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

import dotenv from "dotenv";
dotenv.config();  // ye .env file load karega

console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Customer management
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByGlobalId(globalId: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  searchCustomers(query: string): Promise<Customer[]>;

  // Alert management
  getAlert(id: string): Promise<Alert & { customer: Customer | null } | undefined>;
  getAlerts(filters: {
    status?: string;
    severity?: string;
    city?: string;
    assignedTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<(Alert & { customer: Customer | null })[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: string, updates: Partial<InsertAlert>): Promise<Alert | undefined>;
  getAlertsCount(filters: { status?: string; severity?: string; city?: string }): Promise<number>;

  // Transaction management
  getTransactionsByCustomer(customerId: string, limit?: number): Promise<Transaction[]>;
  getTransactionsByAlert(alertId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Fraud case management
  getFraudCases(limit?: number, offset?: number): Promise<(FraudCase & { 
    customer: Customer | null, 
    alert: Alert | null,
    confirmedByUser: User | null 
  })[]>;
  createFraudCase(fraudCase: InsertFraudCase): Promise<FraudCase>;

  // Investigation notes
  getInvestigationNotes(alertId: string): Promise<(InvestigationNote & { user: User | null })[]>;
  createInvestigationNote(note: InsertInvestigationNote): Promise<InvestigationNote>;

  // Audit logging
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(alertId?: string, userId?: string): Promise<(AuditLog & { user: User | null })[]>;

  // System metrics and analytics
  getSystemMetrics(days?: number): Promise<SystemMetrics[]>;
  createSystemMetrics(metrics: InsertSystemMetrics): Promise<SystemMetrics>;
  getFraudTrends(days?: number): Promise<any[]>;
  getGeographicDistribution(): Promise<any[]>;
  getKPIs(): Promise<{
    suspectedAccounts: number;
    suspendedTransactions: number;
    unreviewedAccounts: number;
    actualFrauds: number;
  }>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Customer management
  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getCustomerByGlobalId(globalId: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.globalId, globalId));
    return customer || undefined;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    return await db.select().from(customers)
      .where(or(
        like(customers.name, `%${query}%`),
        like(customers.email, `%${query}%`),
        like(customers.globalId, `%${query}%`)
      ))
      .limit(20);
  }

  // Alert management
  async getAlert(id: string): Promise<Alert & { customer: Customer | null } | undefined> {
    const result = await db.select({
      alert: alerts,
      customer: customers
    }).from(alerts)
      .leftJoin(customers, eq(alerts.customerId, customers.id))
      .where(eq(alerts.id, id));
    
    if (result.length === 0) return undefined;
    
    return {
      ...result[0].alert,
      customer: result[0].customer
    };
  }

  async getAlerts(filters: {
    status?: string;
    severity?: string;
    city?: string;
    assignedTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<(Alert & { customer: Customer | null })[]> {
    let query = db.select({
      alert: alerts,
      customer: customers
    }).from(alerts)
      .leftJoin(customers, eq(alerts.customerId, customers.id));

    const conditions = [];
    if (filters.status) conditions.push(eq(alerts.status, filters.status));
    if (filters.severity) conditions.push(eq(alerts.severity, filters.severity));
    if (filters.city) conditions.push(eq(alerts.city, filters.city));
    if (filters.assignedTo) conditions.push(eq(alerts.assignedTo, filters.assignedTo));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.orderBy(desc(alerts.createdAt));

    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset) query = query.offset(filters.offset);

    const results = await query;
    
    return results.map(result => ({
      ...result.alert,
      customer: result.customer
    }));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async updateAlert(id: string, updates: Partial<InsertAlert>): Promise<Alert | undefined> {
    const [updatedAlert] = await db.update(alerts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert || undefined;
  }

  async getAlertsCount(filters: { status?: string; severity?: string; city?: string }): Promise<number> {
    const conditions = [];
    if (filters.status) conditions.push(eq(alerts.status, filters.status));
    if (filters.severity) conditions.push(eq(alerts.severity, filters.severity));
    if (filters.city) conditions.push(eq(alerts.city, filters.city));

    let query = db.select({ count: count() }).from(alerts);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const [result] = await query;
    return result.count;
  }

  // Transaction management
  async getTransactionsByCustomer(customerId: string, limit = 10): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(eq(transactions.customerId, customerId))
      .orderBy(desc(transactions.timestamp))
      .limit(limit);
  }

  async getTransactionsByAlert(alertId: string): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(eq(transactions.alertId, alertId))
      .orderBy(desc(transactions.timestamp));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  // Fraud case management
  async getFraudCases(limit = 50, offset = 0): Promise<(FraudCase & { 
    customer: Customer | null, 
    alert: Alert | null,
    confirmedByUser: User | null 
  })[]> {
    const results = await db.select({
      fraudCase: fraudCases,
      customer: customers,
      alert: alerts,
      confirmedByUser: users
    }).from(fraudCases)
      .leftJoin(customers, eq(fraudCases.customerId, customers.id))
      .leftJoin(alerts, eq(fraudCases.alertId, alerts.id))
      .leftJoin(users, eq(fraudCases.confirmedBy, users.id))
      .orderBy(desc(fraudCases.createdAt))
      .limit(limit)
      .offset(offset);

    return results.map(result => ({
      ...result.fraudCase,
      customer: result.customer,
      alert: result.alert,
      confirmedByUser: result.confirmedByUser
    }));
  }

  async createFraudCase(fraudCase: InsertFraudCase): Promise<FraudCase> {
    const [newFraudCase] = await db.insert(fraudCases).values(fraudCase).returning();
    return newFraudCase;
  }

  // Investigation notes
  async getInvestigationNotes(alertId: string): Promise<(InvestigationNote & { user: User | null })[]> {
    const results = await db.select({
      note: investigationNotes,
      user: users
    }).from(investigationNotes)
      .leftJoin(users, eq(investigationNotes.userId, users.id))
      .where(eq(investigationNotes.alertId, alertId))
      .orderBy(desc(investigationNotes.createdAt));

    return results.map(result => ({
      ...result.note,
      user: result.user
    }));
  }

  async createInvestigationNote(note: InsertInvestigationNote): Promise<InvestigationNote> {
    const [newNote] = await db.insert(investigationNotes).values(note).returning();
    return newNote;
  }

  // Audit logging
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getAuditLogs(alertId?: string, userId?: string): Promise<(AuditLog & { user: User | null })[]> {
    let query = db.select({
      auditLog: auditLogs,
      user: users
    }).from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id));

    const conditions = [];
    if (alertId) conditions.push(eq(auditLogs.alertId, alertId));
    if (userId) conditions.push(eq(auditLogs.userId, userId));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.orderBy(desc(auditLogs.timestamp));

    const results = await query;
    return results.map(result => ({
      ...result.auditLog,
      user: result.user
    }));
  }

  // System metrics and analytics
  async getSystemMetrics(days = 30): Promise<SystemMetrics[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await db.select().from(systemMetrics)
      .where(gte(systemMetrics.metricDate, cutoffDate))
      .orderBy(desc(systemMetrics.metricDate));
  }

  async createSystemMetrics(metrics: InsertSystemMetrics): Promise<SystemMetrics> {
    const [newMetrics] = await db.insert(systemMetrics).values(metrics).returning();
    return newMetrics;
  }

  async getFraudTrends(days = 30): Promise<any[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const results = await db.select({
      date: sql<string>`DATE(${fraudCases.createdAt})`,
      count: count(),
      totalLoss: sql<number>`COALESCE(SUM(${fraudCases.lossAmount}), 0)`
    }).from(fraudCases)
      .where(gte(fraudCases.createdAt, cutoffDate))
      .groupBy(sql`DATE(${fraudCases.createdAt})`)
      .orderBy(sql`DATE(${fraudCases.createdAt})`);

    return results;
  }

  async getGeographicDistribution(): Promise<any[]> {
    const results = await db.select({
      city: alerts.city,
      count: count(),
      highSeverity: sql<number>`COUNT(CASE WHEN ${alerts.severity} = 'HIGH' THEN 1 END)`,
      mediumSeverity: sql<number>`COUNT(CASE WHEN ${alerts.severity} = 'MEDIUM' THEN 1 END)`,
      lowSeverity: sql<number>`COUNT(CASE WHEN ${alerts.severity} = 'LOW' THEN 1 END)`
    }).from(alerts)
      .where(eq(alerts.status, 'OPEN'))
      .groupBy(alerts.city)
      .orderBy(desc(count()));

    return results;
  }

  async getKPIs(): Promise<{
    suspectedAccounts: number;
    suspendedTransactions: number;
    unreviewedAccounts: number;
    actualFrauds: number;
  }> {
    const [suspectedAccounts] = await db.select({ count: count() })
      .from(alerts)
      .where(and(
        eq(alerts.status, 'OPEN'),
        eq(alerts.severity, 'HIGH')
      ));

    const [suspendedTransactions] = await db.select({ count: count() })
      .from(transactions)
      .where(eq(transactions.status, 'FLAGGED'));

    const [unreviewedAccounts] = await db.select({ count: count() })
      .from(alerts)
      .where(eq(alerts.status, 'OPEN'));

    const [actualFrauds] = await db.select({ count: count() })
      .from(fraudCases)
      .where(gte(fraudCases.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));

    return {
      suspectedAccounts: suspectedAccounts.count,
      suspendedTransactions: suspendedTransactions.count,
      unreviewedAccounts: unreviewedAccounts.count,
      actualFrauds: actualFrauds.count
    };
  }
}

export const storage = new DatabaseStorage();
