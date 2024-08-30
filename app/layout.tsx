import type { Metadata } from "next";
import localFont from "@next/font/local";
import "./globals.css";

const ChesnaGrotesk = localFont({
  src: [
    {
      path: "../public/fonts/chesnagrotesk-light.otf",
      weight: "100",
    },
    {
      path: "../public/fonts/chesnagrotesk-regular.otf",
      weight: "200",
    },
    {
      path: "../public/fonts/chesnagrotesk-medium.otf",
      weight: "300",
    },
    {
      path: "../public/fonts/chesnagrotesk-semibold.otf",
      weight: "400",
    },
    {
      path: "../public/fonts/chesnagrotesk-bold.otf",
      weight: "500",
    },
  ],
  variable: "--font-ChesnaGrotesk",
});

export const metadata: Metadata = {
  title: "Supervision App",
  description: "App to supervise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ChesnaGrotesk.variable}>{children}</body>
    </html>
  );
}
