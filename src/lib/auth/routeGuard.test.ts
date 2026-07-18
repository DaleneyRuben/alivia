import { describe, expect, it } from "vitest";
import { routeGuard } from "./route-guard";

const doctor = { role: "DOCTOR" as const, doctorOnboarded: true };
const newDoctor = { role: "DOCTOR" as const, doctorOnboarded: false };
const assistant = { role: "ASSISTANT" as const };
const admin = { role: "ADMIN" as const };

describe("routeGuard", () => {
  describe("unauthenticated", () => {
    it("redirects panel routes to login", () => {
      expect(routeGuard("/panel/appointments", null)).toBe("/login");
    });

    it("redirects admin routes to login", () => {
      expect(routeGuard("/admin", null)).toBe("/login");
    });

    it("allows the login page", () => {
      expect(routeGuard("/login", null)).toBeNull();
    });

    it("allows public routes", () => {
      expect(routeGuard("/", null)).toBeNull();
    });
  });

  describe("assistant", () => {
    it("allows shared panel routes", () => {
      expect(routeGuard("/panel/appointments", assistant)).toBeNull();
      expect(routeGuard("/panel/schedules", assistant)).toBeNull();
      expect(routeGuard("/panel/vacations", assistant)).toBeNull();
      expect(routeGuard("/panel/confirmations", assistant)).toBeNull();
    });

    it("redirects doctor-only routes to appointments", () => {
      expect(routeGuard("/panel/locations", assistant)).toBe(
        "/panel/appointments",
      );
      expect(routeGuard("/panel/history", assistant)).toBe(
        "/panel/appointments",
      );
      expect(routeGuard("/panel/account", assistant)).toBe(
        "/panel/appointments",
      );
      expect(routeGuard("/panel/onboarding", assistant)).toBe(
        "/panel/appointments",
      );
    });

    it("redirects admin routes to appointments", () => {
      expect(routeGuard("/admin", assistant)).toBe("/panel/appointments");
    });
  });

  describe("doctor", () => {
    it("allows doctor-only routes", () => {
      expect(routeGuard("/panel/locations", doctor)).toBeNull();
      expect(routeGuard("/panel/history", doctor)).toBeNull();
      expect(routeGuard("/panel/account", doctor)).toBeNull();
    });

    it("redirects admin routes to their panel home", () => {
      expect(routeGuard("/admin", doctor)).toBe("/panel/appointments");
      expect(routeGuard("/admin", newDoctor)).toBe("/panel/onboarding");
    });
  });

  describe("admin", () => {
    it("allows admin routes", () => {
      expect(routeGuard("/admin", admin)).toBeNull();
      expect(routeGuard("/admin/practices", admin)).toBeNull();
    });

    it("redirects panel routes to admin", () => {
      expect(routeGuard("/panel/appointments", admin)).toBe("/admin");
    });
  });

  describe("already logged in", () => {
    it("redirects login to the role home", () => {
      expect(routeGuard("/login", doctor)).toBe("/panel/appointments");
      expect(routeGuard("/login", newDoctor)).toBe("/panel/onboarding");
      expect(routeGuard("/login", assistant)).toBe("/panel/appointments");
      expect(routeGuard("/login", admin)).toBe("/admin");
    });
  });
});
