// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react"; // tùy chọn nếu bạn tách metadata riêng
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ToastProvider";

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
        <CartProvider>
          <Navbar />
          {children}
          <ToastProvider />
        </CartProvider>
      </body>
    </html>
  );
}
