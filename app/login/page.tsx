import Image from "next/image";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { LoginHeader } from "@/app/components/login/login-header";
import { LoginHero } from "@/app/components/login/login-hero";
import { LoginFooter } from "@/app/components/login/login-footer";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

/**
 * SAA 2025 Login page — presentational shell.
 *
 * Layer stack (matches Figma 1440x1024):
 *   z-0  mms_C_Keyvisual   full-bleed wave artwork background (right side)
 *   z-1  Rectangle 57      horizontal dark gradient (left-to-transparent)
 *   z-1  Cover             vertical dark gradient (bottom fade)
 *   z-10 mms_A_Header      absolute-positioned logo + language selector
 *   z-2  mms_B_Bìa         hero content: ROOT FURTHER logo, subtitle, login button
 *   z-2  mms_D_Footer      copyright bar
 *
 * Behavior:
 * - Authenticated users are redirected to "/" (guard below).
 * - The login button drives Google OAuth via GoogleLoginForm → signInWithGoogleAction.
 * - All copy resolves through next-intl ("login" / "footer" namespaces).
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Authenticated users never see the login screen — send them to the homepage.
  const session = await auth();
  if (session) {
    redirect("/");
  }

  const { error, callbackUrl } = await searchParams;

  // Any Google auth failure/cancel surfaces the single localized error message.
  const t = await getTranslations("login");
  const errorMessage = error ? t("loginFailed") : undefined;

  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#00101A",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Layer 0: Full-bleed wave artwork background ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/saa/keyvisual-bg.png"
          alt=""
          fill
          style={{
            objectFit: "cover",
            objectPosition: "right center",
          }}
          priority
        />
      </div>

      {/* ── Layer 1a: Left horizontal dark gradient (Rectangle 57) ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0, 16, 26, 0.00) 100%)",
        }}
      />

      {/* ── Layer 1b: Bottom vertical dark gradient (Cover) ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "60%",
          zIndex: 1,
          background:
            "linear-gradient(0deg, #00101A 22.48%, rgba(0, 19, 32, 0.00) 51.74%)",
        }}
      />

      {/* ── Layer 10: Login-specific header (absolute, above gradients) ── */}
      <LoginHeader />

      {/* ── Layer 2: Hero content (ROOT FURTHER + text + login button) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: "80px", /* offset for absolute header height */
        }}
      >
        <LoginHero errorMessage={errorMessage} callbackUrl={callbackUrl} />
      </div>

      {/* ── Layer 2: Footer ── */}
      <LoginFooter />
    </main>
  );
}
