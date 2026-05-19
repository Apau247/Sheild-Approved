import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const fullName = String(body?.fullName ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const assetType = String(body?.assetType ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, message." },
        { status: 400 }
      );
    }

    // In a real deployment, send to email/CRM or persist to a database.
    // For now, we acknowledge receipt reliably.
    return NextResponse.json(
      {
        ok: true,
        received: {
          fullName,
          email,
          phone: phone || undefined,
          assetType: assetType || undefined,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
