// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react"; // tùy chọn nếu bạn tách metadata riêng
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "E-Commerce App",
  description: "Built with Next.js and Supabase",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="p-4">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
