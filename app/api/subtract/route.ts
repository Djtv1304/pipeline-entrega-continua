import { NextResponse } from "next/server";
import { validatePayload, subtractNumbers } from "../../../src/lib/math";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type debe ser application/json" },
        { status: 415 }
      );
    }

    const body = await req.json();
    const { a, b } = validatePayload(body);
    const result = subtractNumbers(a, b);
    return NextResponse.json({ result }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error de solicitud";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

