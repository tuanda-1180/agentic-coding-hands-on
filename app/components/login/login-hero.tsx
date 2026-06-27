import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { GoogleLoginForm } from "./google-login-form";

interface LoginHeroProps {
  errorMessage?: string;
  callbackUrl?: string;
}

/**
 * mms_B_Bìa section — left-aligned content block over the hero.
 * Figma: 1440x845, pt-96 pb-96 px-144. Inner column gap 80px.
 * Layout:
 *   - mms_B.1_Key Visual: ROOT FURTHER logo image (451x200px)
 *   - Frame 550 (gap 24px, pl-16):
 *       - mms_B.2_content text block (Montserrat Bold 20px / lh 40px)
 *       - mms_B.3_Login: LoginButton
 *
 * Responsive: mobile collapses padding + logo/text scale down. Tablet is in-between.
 */
export async function LoginHero({ errorMessage, callbackUrl }: LoginHeroProps) {
  const t = await getTranslations("login");
  return (
    <section
      className="login-hero-section"
      style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      {/* Responsive styles injected once */}
      <style>{`
        .login-hero-section {
          padding: 60px 24px 60px 24px;
          min-height: 600px;
          gap: 60px;
        }
        .login-hero-logo {
          width: 220px;
          height: 100px;
        }
        .login-hero-text-col {
          padding-left: 8px;
          width: 100%;
          gap: 20px;
        }
        .login-hero-text {
          width: 100%;
          font-size: 16px;
          line-height: 28px;
        }
        @media (min-width: 768px) {
          .login-hero-section {
            padding: 80px 48px 80px 48px;
            min-height: 700px;
            gap: 80px;
          }
          .login-hero-logo {
            width: 340px;
            height: 150px;
          }
          .login-hero-text-col {
            padding-left: 12px;
            width: 420px;
            gap: 24px;
          }
          .login-hero-text {
            width: 400px;
            font-size: 18px;
            line-height: 34px;
          }
        }
        @media (min-width: 1280px) {
          .login-hero-section {
            padding: 96px 144px 96px 144px;
            min-height: 845px;
            gap: 120px;
          }
          .login-hero-logo {
            width: 451px;
            height: 200px;
          }
          .login-hero-text-col {
            padding-left: 16px;
            width: 496px;
            gap: 24px;
          }
          .login-hero-text {
            width: 480px;
            font-size: 20px;
            line-height: 40px;
          }
        }
      `}</style>

      {/* Inner content column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "inherit",
          width: "100%",
          maxWidth: "1152px",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {/* ROOT FURTHER logo image */}
        <div
          className="login-hero-logo"
          style={{
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src="/saa/root-further-logo.png"
            alt={t("heroTitle")}
            fill
            style={{ objectFit: "contain", objectPosition: "left center" }}
            priority
          />
        </div>

        {/* Text + button column */}
        <div
          className="login-hero-text-col"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Subtitle + tagline */}
          <p
            className="login-hero-text"
            style={{
              margin: 0,
              fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "#FFFFFF",
            }}
          >
            {t("heroSubtitle")}
            <br />
            {t("heroTagline")}
          </p>

          {/* Login button → Google OAuth */}
          <GoogleLoginForm errorMessage={errorMessage} callbackUrl={callbackUrl} />
        </div>
      </div>
    </section>
  );
}
