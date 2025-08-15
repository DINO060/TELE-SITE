import type { Handler } from "@netlify/functions";
import jwt from "jsonwebtoken";

const isProd = !process.env.NETLIFY_DEV;

function sessionCookie(value: string) {
  return [
    `session=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=2592000", // 30 jours
    isProd ? "Secure" : ""
  ].filter(Boolean).join("; ");
}

export const handler: Handler = async (event) => {
  try {
    const token = event.queryStringParameters?.token;
    if (!token) return { statusCode: 400, body: "Missing token" };

    if (!process.env.WEBAPP_SSO_SECRET) return { statusCode: 500, body: "Missing WEBAPP_SSO_SECRET" };
    if (!process.env.JWT_SECRET) return { statusCode: 500, body: "Missing JWT_SECRET" };

    const sso = jwt.verify(token, process.env.WEBAPP_SSO_SECRET) as any;
    if (!sso?.uid) return { statusCode: 401, body: "Invalid token" };

    const session = jwt.sign({ uid: Number(sso.uid) }, process.env.JWT_SECRET, { expiresIn: "30d" });
    const location = typeof sso.redirect === "string" ? sso.redirect : "/channels";

    return {
      statusCode: 302,
      headers: {
        "Set-Cookie": sessionCookie(session),
        "Location": location,
      },
      body: "",
    };
  } catch (e:any) {
    console.error("SSO error:", e);
    return { statusCode: 302, headers: { Location: "/login?err=sso" }, body: "" };
  }
};
