import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monfinancement - Your Trusted Financing Partner",
  description: "Professional non-refundable financing platform connecting you with the best funding opportunities.",
  keywords: ["financing", "funding", "monfinancement", "non-refundable financing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
