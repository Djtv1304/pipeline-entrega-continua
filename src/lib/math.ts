export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function validatePayload(input: unknown): { a: number; b: number } {
  if (input === null || typeof input !== "object") {
    throw new Error("El cuerpo debe ser un objeto JSON");
  }
  const { a, b } = input as { a?: unknown; b?: unknown };
  if (!isNumber(a)) throw new Error("'a' debe ser un número válido");
  if (!isNumber(b)) throw new Error("'b' debe ser un número válido");
  return { a, b } as { a: number; b: number };
}

export function addNumbers(a: number, b: number): number {
  return a + b;
}

export function subtractNumbers(a: number, b: number): number {
  return a - b;
}

