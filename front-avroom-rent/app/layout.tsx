import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AVRoom",
  description: "Sistema Gestion Material Audiovisual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
          <footer className="bg-primaryColor text-white text-center py-2 mt-auto" style={{ width: "100%" }}>
            <p style={{ fontSize: "13px" }}>
              &copy; 2024 AVRoom. All rights reserved.
            </p>
          </footer>
      </body>
    </html>
  );
}
