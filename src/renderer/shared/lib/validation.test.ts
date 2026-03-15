import { describe, it, expect } from "vitest";
import { validatePatient } from "./validation";

describe("validatePatient", () => {
  it("should validate a valid patient name", () => {
    const result = validatePatient({ name: "Juan Perez" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Juan Perez");
    }
  });

  it("should fail when name is too short", () => {
    const result = validatePatient({ name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain("El nombre debe tener al menos 2 caracteres");
    }
  });

  it("should fail when name is empty", () => {
    const result = validatePatient({ name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain("El nombre debe tener al menos 2 caracteres");
    }
  });

  it("should fail when name contains numbers", () => {
    const result = validatePatient({ name: "Juan123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain("El nombre solo puede contener letras y espacios");
    }
  });

  it("should fail when name is too long", () => {
    const result = validatePatient({ name: "A".repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain("El nombre no puede tener más de 100 caracteres");
    }
  });

  it("should accept names with accents and ñ", () => {
    const result = validatePatient({ name: "José María Nuñez" });
    expect(result.success).toBe(true);
  });
});
