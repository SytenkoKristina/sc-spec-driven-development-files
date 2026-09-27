import { vi } from "vitest";

export function createDbMock() {
  return {
    agent: {
      upsert: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
    ailment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    appointment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    session: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  };
}
