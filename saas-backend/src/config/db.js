import "./env.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

console.log("[DB] Initializing... NODE_ENV:", process.env.NODE_ENV, "VITEST:", process.env.VITEST);

let prisma;
let realClient;

if (process.env.NODE_ENV === "test" || process.env.VITEST) {
  console.log("[DB] Using test mock - no database connection");
  // Create a mock-ready object that won't connect
  
  const createMockMethod = (name) => {
    return function(...args) {
      console.log(`[DB Mock] Called ${name}`, args);
      return Promise.resolve({});
    };
  };
  
  prisma = {
    user: {
      findUnique: vi.fn?.() || createMockMethod('user.findUnique'),
      create: vi.fn?.() || createMockMethod('user.create'),
      findMany: vi.fn?.() || createMockMethod('user.findMany'),
      update: vi.fn?.() || createMockMethod('user.update'),
    },
    tenant: {
      create: vi.fn?.() || createMockMethod('tenant.create'),
      findUnique: vi.fn?.() || createMockMethod('tenant.findUnique'),
    },
    project: {
      create: vi.fn?.() || createMockMethod('project.create'),
      findMany: vi.fn?.() || createMockMethod('project.findMany'),
      findUnique: vi.fn?.() || createMockMethod('project.findUnique'),
    },
    refreshSession: {
      create: vi.fn?.() || createMockMethod('refreshSession.create'),
      findUnique: vi.fn?.() || createMockMethod('refreshSession.findUnique'),
      update: vi.fn?.() || createMockMethod('refreshSession.update'),
      updateMany: vi.fn?.() || createMockMethod('refreshSession.updateMany'),
      findMany: vi.fn?.() || createMockMethod('refreshSession.findMany'),
    },
    $transaction: (cb) => cb(prisma),
  };
} else {
  console.log("[DB] Using real PrismaClient");
  const { PrismaClient } = require("@prisma/client");
  realClient = new PrismaClient();
  prisma = realClient;
}

export default prisma;