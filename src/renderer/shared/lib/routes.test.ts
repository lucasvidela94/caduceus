import { describe, it, expect } from "vitest";
import { ROUTES, ROUTE_LABELS, BREADCRUMB_MAP } from "./routes";

describe("routes", () => {
  describe("ROUTES", () => {
    it("should have home route", () => {
      expect(ROUTES.HOME).toBe("/");
    });

    it("should have patients list route", () => {
      expect(ROUTES.PATIENTS.LIST).toBe("/patients");
    });

    it("should have new patient route", () => {
      expect(ROUTES.PATIENTS.NEW).toBe("/patients/new");
    });
  });

  describe("ROUTE_LABELS", () => {
    it("should have labels for all routes", () => {
      expect(ROUTE_LABELS[ROUTES.HOME]).toBe("Dashboard");
      expect(ROUTE_LABELS[ROUTES.PATIENTS.LIST]).toBe("Pacientes");
      expect(ROUTE_LABELS[ROUTES.PATIENTS.NEW]).toBe("Nuevo Paciente");
    });
  });

  describe("BREADCRUMB_MAP", () => {
    it("should have breadcrumb for home", () => {
      const breadcrumb = BREADCRUMB_MAP[ROUTES.HOME];
      expect(breadcrumb).toHaveLength(1);
      expect(breadcrumb[0].label).toBe("Dashboard");
    });

    it("should have breadcrumb for patients list", () => {
      const breadcrumb = BREADCRUMB_MAP[ROUTES.PATIENTS.LIST];
      expect(breadcrumb).toHaveLength(1);
      expect(breadcrumb[0].label).toBe("Pacientes");
      expect(breadcrumb[0].href).toBe("#/patients");
    });

    it("should have breadcrumb for new patient", () => {
      const breadcrumb = BREADCRUMB_MAP[ROUTES.PATIENTS.NEW];
      expect(breadcrumb).toHaveLength(2);
      expect(breadcrumb[0].label).toBe("Pacientes");
      expect(breadcrumb[1].label).toBe("Nuevo");
    });
  });
});
