import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const CONTACT_TO_EMAIL =
  process.env.CONTACT_TO_EMAIL ?? "IronVaultSecurity@protonmail.com";
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "Iron Vault Security <onboarding@resend.dev>";

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().optional(),
  assetType: z.string().trim().optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Contact email service is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const body = await req.json();
    const validated = contactSchema.parse(body);
    const safeMessage = escapeHtml(validated.message).replace(/\n/g, "<br />");

    await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      subject: `New inquiry from ${validated.fullName}`,
      replyTo: validated.email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(validated.fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(validated.email)}</p>
        ${
          validated.phone
            ? `<p><strong>Phone:</strong> ${escapeHtml(validated.phone)}</p>`
            : ""
        }
        ${
          validated.assetType
            ? `<p><strong>Asset Type:</strong> ${escapeHtml(
                validated.assetType
              )}</p>`
            : ""
        }
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your inquiry has been received.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
