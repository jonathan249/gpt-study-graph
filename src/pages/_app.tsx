import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { fontSans } from "~/utils/font";
import { api } from "~/utils/api";

import "~/styles/globals.css";

const MindGraph: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`min-h-screen w-full ${fontSans.variable} !font-sans`}>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </main>
  );
};

export default api.withTRPC(MindGraph);
