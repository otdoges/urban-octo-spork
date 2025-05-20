import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Playground - Website Converter",
  description: "AI-powered website converter using WebContainers and GitHub AI models",
};

export default function AIPlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
