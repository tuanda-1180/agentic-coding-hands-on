import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import SiteChrome from "./components/layout/site-chrome";
import KudoComposeProvider from "./components/kudos/kudo-compose-provider";
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
  title: "Sự kiện sẽ bắt đầu sau",
  description: "Countdown prelaunch page",
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
      className={`${montserrat.variable} ${ledFont.variable} h-full`}
      // Browser extensions (e.g. Immersive Translate, theme/dark-mode addons) inject
      // attributes onto <html> before React hydrates, causing a benign mismatch.
      // suppressHydrationWarning only silences this element's own attributes, not its subtree.
      suppressHydrationWarning
    >
      <body className="h-full">
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <KudoComposeProvider>
              <SiteChrome>{children}</SiteChrome>
            </KudoComposeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
