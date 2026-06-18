import { describe, it, expect } from "vitest";
import {
  findUserByEmail,
  verifyCredentials,
} from "../auth/users";

describe("findUserByEmail", () => {
  it("returns user for known email (case-insensitive)", () => {
    const user = findUserByEmail("user@sun.example");
    expect(user).toBeDefined();
    expect(user?.email).toBe("user@sun.example");
    expect(user?.role).toBe("regular");
  });

  it("returns admin user", () => {
    const user = findUserByEmail("admin@sun.example");
    expect(user).toBeDefined();
    expect(user?.role).toBe("admin");
  });

  it("returns undefined for unknown email", () => {
    expect(findUserByEmail("nobody@example.com")).toBeUndefined();
  });

  it("is case-insensitive", () => {
    expect(findUserByEmail("USER@SUN.EXAMPLE")).toBeDefined();
  });
});

describe("verifyCredentials", () => {
  it("returns public user with role for correct regular user credentials", async () => {
    const result = await verifyCredentials("user@sun.example", "user1234");
    expect(result).not.toBeNull();
    expect(result?.email).toBe("user@sun.example");
    expect(result?.role).toBe("regular");
    // Must not expose password hash
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("returns public user with admin role for correct admin credentials", async () => {
    const result = await verifyCredentials("admin@sun.example", "admin1234");
    expect(result).not.toBeNull();
    expect(result?.role).toBe("admin");
  });

  it("returns null for correct email but wrong password", async () => {
    const result = await verifyCredentials("user@sun.example", "wrongpass");
    expect(result).toBeNull();
  });

  it("returns null for unknown email", async () => {
    const result = await verifyCredentials("ghost@example.com", "user1234");
    expect(result).toBeNull();
  });

  it("returns null for empty email", async () => {
    const result = await verifyCredentials("", "user1234");
    expect(result).toBeNull();
  });

  it("returns null for empty password", async () => {
    const result = await verifyCredentials("user@sun.example", "");
    expect(result).toBeNull();
  });

  it("returns null for both empty", async () => {
    const result = await verifyCredentials("", "");
    expect(result).toBeNull();
  });

  it("returns an object with id, email, name, role fields", async () => {
    const result = await verifyCredentials("user@sun.example", "user1234");
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("role");
  });
});
