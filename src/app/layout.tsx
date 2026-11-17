import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import { themeCookieName, defaultTheme } from "@/lib/theme/config";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Noto_Sans_Bengali({
  variable: "--font-body",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const bengaliSerif = Noto_Serif_Bengali({
  variable: "--font-bn-serif",
  subsets: ["bengali", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Opekkha — অপেক্ষা",
    template: "%s · Opekkha",
  },
  description:
    "Write something today. Let someone open it when it matters. Bengali-first digital letters.",
  openGraph: {
    title: "Opekkha — অপেক্ষা",
    description:
      "Personal digital letters for the moments that matter. Private by default.",
    type: "website",
  },
};

const themeBootScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${themeCookieName}=([^;]*)/);var t=m?decodeURIComponent(m[1]):"${defaultTheme}";if(t!=="light"&&t!=="dark")t="${defaultTheme}";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","${defaultTheme}");}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      data-theme={defaultTheme}
      className={`${display.variable} ${body.variable} ${bengaliSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
