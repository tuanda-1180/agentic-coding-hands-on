import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import SiteChrome from "./components/layout/site-chrome";
import KudoComposeProvider from "./components/kudos/kudo-compose-provider";
import SecretBoxProvider from "./components/secret-box/secret-box-provider";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./lib/site-config";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const ledFont = localFont({
  src: "./fonts/dseg7-classic-bold.woff2",
  variable: "--font-led",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // `default` titles the homepage; `template` suffixes every child page that
  // sets its own title (e.g. a user's profile).
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${ledFont.variable}`}
      // Browser extensions (e.g. Immersive Translate, theme/dark-mode addons) inject
      // attributes onto <html> before React hydrates, causing a benign mismatch.
      // suppressHydrationWarning only silences this element's own attributes, not its subtree.
      suppressHydrationWarning
    >
      <body>
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <KudoComposeProvider>
              <SecretBoxProvider>
                <SiteChrome>{children}</SiteChrome>
              </SecretBoxProvider>
            </KudoComposeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
