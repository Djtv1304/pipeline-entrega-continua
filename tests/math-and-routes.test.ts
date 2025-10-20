import { describe, it, expect } from "vitest";
import { addNumbers, subtractNumbers, validatePayload } from "../src/lib/math";
import * as AddRoute from "../app/api/add/route";
import * as SubtractRoute from "../app/api/subtract/route";

describe("Funciones matemáticas", () => {
  it("suma dos números correctamente", () => {
    expect(addNumbers(2, 3)).toBe(5);
  });

  it("resta dos números correctamente", () => {
    expect(subtractNumbers(3, 7)).toBe(-4);
  });

  it("valida que 'a' y 'b' sean numéricos", () => {
    // 'a' inválido
    expect(() => validatePayload({ a: "2", b: 3 } as any)).toThrow();
    // 'b' inválido
    expect(() => validatePayload({ a: 2, b: NaN } as any)).toThrow();
  });
});

describe("Rutas API", () => {
  it("POST /api/add retorna el resultado en JSON", async () => {
    const req = new Request("http://localhost/api/add", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ a: 10, b: 15 })
    });
    const res = await (AddRoute as any).POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ result: 25 });
  });

  it("POST /api/subtract retorna el resultado en JSON", async () => {
    const req = new Request("http://localhost/api/subtract", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ a: 5, b: 12 })
    });
    const res = await (SubtractRoute as any).POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ result: -7 });
  });
});

