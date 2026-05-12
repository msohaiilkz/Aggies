import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertAlertSchema, insertInvestigationNoteSchema, insertAuditLogSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };

  // Dashboard KPIs
  app.get("/api/kpis", requireAuth, async (req, res) => {
    try {
      const kpis = await storage.getKPIs();
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KPIs" });
    }
  });

  // Alerts management
  app.get("/api/alerts", requireAuth, async (req, res) => {
    try {
      const { status, severity, city, limit = 50, offset = 0 } = req.query;
      const alerts = await storage.getAlerts({
        status: status as string,
        severity: severity as string,
        city: city as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/count", requireAuth, async (req, res) => {
    try {
      const { status, severity, city } = req.query;
      const count = await storage.getAlertsCount({
        status: status as string,
        severity: severity as string,
        city: city as string
      });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alert count" });
    }
  });

  app.get("/api/alerts/:id", requireAuth, async (req, res) => {
    try {
      const alert = await storage.getAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alert" });
    }
  });

  app.patch("/api/alerts/:id", requireAuth, async (req, res) => {
    try {
      const updateSchema = insertAlertSchema.partial();
      const updates = updateSchema.parse(req.body);
      
      const updatedAlert = await storage.updateAlert(req.params.id, updates);
      if (!updatedAlert) {
        return res.status(404).json({ message: "Alert not found" });
      }

      // Create audit log
      await storage.createAuditLog({
        userId: req.user!.id,
        alertId: req.params.id,
        action: "UPDATE_ALERT",
        oldValue: null,
        newValue: JSON.stringify(updates)
      });

      res.json(updatedAlert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  // Mark alert as fraud
  app.post("/api/alerts/:id/mark-fraud", requireAuth, async (req, res) => {
    try {
      const { investigationNotes, fraudType, lossAmount } = req.body;
      
      // Update alert status
      const updatedAlert = await storage.updateAlert(req.params.id, {
        status: "MARKED_FRAUD",
        assignedTo: req.user!.id
      });

      if (!updatedAlert) {
        return res.status(404).json({ message: "Alert not found" });
      }

      // Create fraud case
      await storage.createFraudCase({
        alertId: req.params.id,
        customerId: updatedAlert.customerId!,
        fraudType,
        lossAmount,
        confirmedBy: req.user!.id,
        investigationNotes
      });

      // Create audit log
      await storage.createAuditLog({
        userId: req.user!.id,
        alertId: req.params.id,
        action: "MARK_AS_FRAUD",
        oldValue: "OPEN",
        newValue: "MARKED_FRAUD"
      });

      res.json({ message: "Alert marked as fraud successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark alert as fraud" });
    }
  });

  // Transactions
  app.get("/api/customers/:id/transactions", requireAuth, async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const transactions = await storage.getTransactionsByCustomer(
        req.params.id, 
        parseInt(limit as string)
      );
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/alerts/:id/transactions", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByAlert(req.params.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alert transactions" });
    }
  });

  // Investigation notes
  app.get("/api/alerts/:id/notes", requireAuth, async (req, res) => {
    try {
      const notes = await storage.getInvestigationNotes(req.params.id);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investigation notes" });
    }
  });

  app.post("/api/alerts/:id/notes", requireAuth, async (req, res) => {
    try {
      const noteData = insertInvestigationNoteSchema.parse({
        ...req.body,
        alertId: req.params.id,
        userId: req.user!.id
      });
      
      const note = await storage.createInvestigationNote(noteData);
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.user!.id,
        alertId: req.params.id,
        action: "ADD_NOTE",
        oldValue: null,
        newValue: noteData.note
      });

      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to create investigation note" });
    }
  });

  // Fraud cases
  app.get("/api/fraud-cases", requireAuth, async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const fraudCases = await storage.getFraudCases(
        parseInt(limit as string),
        parseInt(offset as string)
      );
      res.json(fraudCases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fraud cases" });
    }
  });

  // Analytics and reports
  app.get("/api/analytics/fraud-trends", requireAuth, async (req, res) => {
    try {
      const { days = 30 } = req.query;
      const trends = await storage.getFraudTrends(parseInt(days as string));
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fraud trends" });
    }
  });

  app.get("/api/analytics/geographic-distribution", requireAuth, async (req, res) => {
    try {
      const distribution = await storage.getGeographicDistribution();
      res.json(distribution);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch geographic distribution" });
    }
  });

  app.get("/api/analytics/system-metrics", requireAuth, async (req, res) => {
    try {
      const { days = 30 } = req.query;
      const metrics = await storage.getSystemMetrics(parseInt(days as string));
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system metrics" });
    }
  });

  // Audit logs
  app.get("/api/audit-logs", requireAuth, async (req, res) => {
    try {
      const { alertId, userId } = req.query;
      const logs = await storage.getAuditLogs(
        alertId as string,
        userId as string
      );
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Customer search
  app.get("/api/customers/search", requireAuth, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || (q as string).length < 2) {
        return res.json([]);
      }
      const customers = await storage.searchCustomers(q as string);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to search customers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
