import { NextResponse } from "next/server";

export function apiOk<T>(data?: T, message = "OK", init?: number) {
  return NextResponse.json({ success: true, message, data }, { status: init ?? 200 });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}
