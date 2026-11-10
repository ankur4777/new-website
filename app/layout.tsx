import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import "./design-studio.css";
import "./spark-catch.css";
import "./project-builder.css";
import SiteShell from "@/components/studio/site-shell";
import { company } from "@/lib/studio-content";
export const metadata: Metadata = {
  title: {
    default: `${company.name} — Digital, done differently.`,
    template: `%s | ${company.name}`,
  },
  description:
    "A different perspective on digital. Digital marketing, websites, web applications, custom software, and mobile apps — thoughtfully connected.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
