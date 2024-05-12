// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { Gabarito } from "next/font/google";
import "./styles.css";

const gabarito = Gabarito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gabarito",
});

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={gabarito.variable}>{children}</body>
    </html>
  );
}
