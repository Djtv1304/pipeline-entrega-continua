import { isNewMathLogicEnabled } from '../launchDarkly';

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

export async function addNumbers(a: number, b: number, userKey = 'anonymous'): Promise<number | { result: number; message: string }> {

  const enabled = await isNewMathLogicEnabled(userKey);

  if (enabled) {
    return {
      result: a + b,
      message: "✨ Patrocinado por LaunchDarkly - Feature Flag Activado"
    };
  }

  return a + b;
}

export async function subtractNumbers(a: number, b: number, userKey = 'anonymous'): Promise<number | { result: number; message: string }> {
  const enabled = await isNewMathLogicEnabled(userKey);

  if (enabled) {
    return {
      result: a - b,
      message: "✨ Patrocinado por LaunchDarkly - Feature Flag Activado"
    };
  }

  return a - b;
}

