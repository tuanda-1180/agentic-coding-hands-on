import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: "700",
});

const ledFont = localFont({
  src: "./fonts/dseg7-classic-bold.woff2",
  variable: "--font-led",
});

export const metadata: Metadata = {
  title: "Sự kiện sẽ bắt đầu sau",
  description: "Countdown prelaunch page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${montserrat.variable} ${ledFont.variable} h-full`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
