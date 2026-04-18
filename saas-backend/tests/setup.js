import { vi } from 'vitest';

// Mock Prisma BEFORE any modules that import it
vi.mock('../src/config/db.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    tenant: {
      create: vi.fn(),
    },
    refreshSession: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb),
  },
}));

// Mock JWT utils
vi.mock('../src/utils/jwt.js', () => ({
  generateAccessToken: vi.fn(() => 'mock-access-token'),
  generateRefreshToken: vi.fn(() => 'mock-refresh-token'),
  verifyAccessToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
}));

// Mock hash functions
vi.mock('../src/utils/hash.js', () => ({
  hashPassword: vi.fn((pwd) => Promise.resolve('hashed-' + pwd)),
  comparePassword: vi.fn(),
}));

// Mock ioredis
vi.mock('ioredis', () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      call: vi.fn(),
      set: vi.fn(),
      get: vi.fn(),
      del: vi.fn(),
    })),
  };
});

// Mock Redis config
vi.mock('../src/config/redis.js', () => ({
  default: {
    call: vi.fn(),
    on: vi.fn(),
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  },
}));
