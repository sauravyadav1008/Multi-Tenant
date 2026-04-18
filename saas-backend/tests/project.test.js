import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/db.js";
import * as jwtUtils from "../src/utils/jwt.js";

describe("Project Controller - Tenant Isolation & RBAC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockAdminToken = "valid-admin-token";
  const mockUserToken = "valid-user-token";
  const tenantId = "tenant-1";

  describe("POST /api/projects", () => {
    it("should allow ADMIN to create a project with correct tenantId", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({
        userId: "admin-1",
        tenantId: tenantId,
        role: "ADMIN",
      });

      const projectData = { name: "Project Alpha" };
      prisma.project.create.mockResolvedValue({ id: "p1", ...projectData, tenantId });

      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${mockAdminToken}`)
        .send(projectData);

      expect(response.status).toBe(200);
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: { name: "Project Alpha", tenantId },
      });
    });

    it("should deny USER from creating a project", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({
        userId: "user-1",
        tenantId: tenantId,
        role: "USER",
      });

      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${mockUserToken}`)
        .send({ name: "Project Beta" });

      expect(response.status).toBe(403); // From authorizeRoles
      expect(prisma.project.create).not.toHaveBeenCalled();
    });

    it("should return 403 if tenantId is missing in token", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({
        userId: "admin-1",
        role: "ADMIN",
        // missing tenantId
      });

      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${mockAdminToken}`)
        .send({ name: "Project Gamma" });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Access Denied: Tenant context missing");
    });
  });

  describe("GET /api/projects", () => {
    it("should only fetch projects belonging to the user's tenant", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({
        userId: "user-1",
        tenantId: "tenant-ABC",
        role: "USER",
      });

      prisma.project.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/projects")
        .set("Authorization", `Bearer ${mockUserToken}`);

      expect(response.status).toBe(200);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { tenantId: "tenant-ABC" },
      });
    });
  });
});
