import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Navigation } from "@/components/Navigation";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finance Management System",
  description: "Advanced Financial Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
