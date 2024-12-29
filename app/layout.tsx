import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Join Waitlist",
    description: "Join our waitlist to get early access",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>{children}

                    <Analytics />

                </Providers>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: '#18181B',
                            color: '#fff',
                            minWidth: '250px',
                        },
                        duration: 4000,
                    }}
                />
            </body>
        </html>
    );
}
