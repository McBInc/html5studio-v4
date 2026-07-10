// src/lib/auth.ts
import type { NextAuthOptions, LoggerInstance } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

function serializeError(e: unknown) {
  const anyE = e as any;

  if (typeof ErrorEvent !== "undefined" && e instanceof ErrorEvent) {
    return {
      name: "ErrorEvent",
      message: e.message,
      filename: (e as any).filename,
      lineno: (e as any).lineno,
      colno: (e as any).colno,
      inner: (e as any).error
        ? {
            name: (e as any).error?.name,
            message: (e as any).error?.message,
            stack: (e as any).error?.stack,
            code: (e as any).error?.code,
            response: (e as any).error?.response,
            responseCode: (e as any).error?.responseCode,
            command: (e as any).error?.command,
          }
        : null,
    };
  }

  if (anyE && typeof anyE === "object") {
    return {
      name: anyE.name,
      message: anyE.message,
      stack: anyE.stack,
      code: anyE.code,
      response: anyE.response,
      responseCode: anyE.responseCode,
      command: anyE.command,
      cause: anyE.cause,
    };
  }

  return { value: String(e) };
}

const logger: Partial<LoggerInstance> = {
  error(code, metadata) {
    console.error("[next-auth][error]", code, serializeError(metadata));
  },
  warn(code) {
    console.warn("[next-auth][warn]", code);
  },
  debug(code, metadata) {
    console.log("[next-auth][debug]", code, metadata);
  },
};

// Accept multiple env var naming schemes (yours + common ones)
function getGitHubClientId() {
  return (
    process.env.GITHUB_CLIENT_ID ||
    process.env.AUTH_GITHUB_ID ||
    process.env.GITHUB_ID ||
    ""
  );
}

function getGitHubClientSecret() {
  return (
    process.env.GITHUB_CLIENT_SECRET ||
    process.env.AUTH_GITHUB_SECRET ||
    process.env.GITHUB_SECRET ||
    ""
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "database" },
  debug: true,
  logger,

  providers: [
    GitHubProvider({
      clientId: getGitHubClientId(),
      clientSecret: getGitHubClientSecret(),
      // needed for repo creation + uploads later
      authorization: { params: { scope: "read:user user:email repo" } },
    }),

    EmailProvider({
      server: {
        host: "smtp.postmarkapp.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.POSTMARK_SERVER_TOKEN!, // NOTE: likely wrong for Postmark SMTP (fix later)
          pass: process.env.POSTMARK_SERVER_TOKEN!,
        },
      },
      from: process.env.POSTMARK_FROM_EMAIL!,

      async sendVerificationRequest(params) {
        try {
          const nodemailer = await import("nodemailer");
          const transport = nodemailer.createTransport(params.provider.server as any);

          const { identifier, url, provider } = params;

          const result = await transport.sendMail({
            to: identifier,
            from: provider.from,
            subject: "Sign in to Unity HTML5 Studio",
            text: `Sign in:\n${url}\n`,
            html: `<p>Sign in:</p><p><a href="${url}">${url}</a></p>`,
            headers: { "X-PM-MESSAGE-STREAM": "outbound" },
          });

          console.log("[auth] sendMail result:", result);
        } catch (e: any) {
          console.error("[auth] sendVerificationRequest FAILED:", {
            message: e?.message,
            code: e?.code,
            response: e?.response,
            responseCode: e?.responseCode,
            command: e?.command,
          });
          throw e;
        }
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allow same-origin absolute callback URLs only
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch {
        // ignore
      }

      // Safe fallback (prevents 404 / cross-domain weirdness)
      return `${baseUrl}/history`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};