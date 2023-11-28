import { Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  preload: true,
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});
