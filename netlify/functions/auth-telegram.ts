import type { Handler } from "@netlify/functions";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const isProd = !process.env.NETLIFY_DEV;

function verify(payload: Record<string, any>, botToken: string) {
  const { hash, ...data } = payload;
  if (!hash || !data.id || !data.auth_date) return false;
  const check = Object.keys(data).sort().map(k => `${k}=${data[k]}`).join("\n");
  const secret = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto.createHmac("sha256", secret).update(check).digest("hex");
  const fresh = Math.abs(Date.now()/1000 - Number(data.auth_date)) < 24*60*60;
  return hmac === hash && fresh;
}

function sessionCookie(value: string) {
  return [
    `session=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=2592000",
    isProd ? "Secure" : ""
  ].filter(Boolean).join("; ");
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const ct = event.headers["content-type"] || "";
  if (!ct.includes("application/json")) return { statusCode: 415, body: "Unsupported Media Type" };

  try {
    const body = JSON.parse(event.body || "{}");
    if (!process.env.BOT_TOKEN) return { statusCode: 500, body: JSON.stringify({ error: "Missing BOT_TOKEN" }) };
    if (!process.env.JWT_SECRET) return { statusCode: 500, body: JSON.stringify({ error: "Missing JWT_SECRET" }) };

    if (!verify(body, process.env.BOT_TOKEN)) {
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid Telegram signature" }) };
    }

    const token = jwt.sign(
      {
        id: body.id,
        username: body.username,
        first_name: body.first_name,
        last_name: body.last_name,
        photo_url: body.photo_url,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': sessionCookie(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true,
        user: {
          id: String(body.id),
          username: body.username || `${body.first_name || 'User'}`,
          avatar: body.photo_url || '',
          telegramHandle: body.username ? `@${body.username}` : undefined,
        }
      }),
    };
  } catch (e:any) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
