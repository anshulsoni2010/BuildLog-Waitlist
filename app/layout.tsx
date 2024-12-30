import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Join BuildLog Waitlist - Organize Your Projects Effortlessly",
    description: "Be among the first to get access to BuildLog!",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    keywords: [
        "Buidlog",
        "Anshul Soni",
        "12 y/o dev Anshul",
        "Anshul Soni X Buildlog",
        "#Buildinpublic",
        "waitlist",
        "get early access of Buildlog",
        "waitlist of Buildlog",
        "young developer anshul",
        "@anshulsoni2010",
        "ai features",
        "productivity for indie-hackers",
        "best management tool for Indie-hackers",
        "developer productivity",
        "project management",
        "task tracking",
        "indie maker tools",
        "startup tools",
        "build in public tools",
        "developer workflow",
        "project organization",
        "young entrepreneur",
        "teen developer",
        "next generation tools",
        "AI-powered management"
    ],
    authors: [{ name: "Anshul Soni" }],
    category: "Software",
    icons: {
        icon: [
            { url: '/logo.png', sizes: '32x32', type: 'image/png' },
            { url: '/logo.png', sizes: '16x16', type: 'image/png' }
        ],
        apple: [
            { url: '/logo.png' }
        ],
    },
    manifest: '/manifest.json',
    openGraph: {
        title: "Join BuildLog Waitlist - Organize Your Projects Effortlessly",
        description: "Be among the first to get access to BuildLog!",
        images: [
            {
                url: '/preview.png',
                width: 1200,
                height: 630,
                alt: 'BuildLog Preview Image',
            },
            {
                url: '/logo.png',
                width: 512,
                height: 512,
                alt: 'BuildLog Logo',
            },
    
        ],
        locale: 'en_US',
        type: 'website',
        siteName: 'BuildLog',
        url: process.env.NEXT_PUBLIC_APP_URL,
    },
    other: {
        'og:image:width': '1200',
        'og:image:height': '630',
        'pinterest:description': "Be among the first to get access to BuildLog!",
        'pinterest:image': '/preview.png',
        'reddit:title': 'Join BuildLog Waitlist - Stay Organize & Build Boldly!',
        'reddit:image': '/preview.png',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Join BuildLog Waitlist - Organize Your Projects Effortlessly",
        description: "Be among the first to get access to BuildLog!",
        images: ['/preview.png'],
        creator: '@AnshulSoni2010',
        site: '@AnshulSoni2010',
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_APP_URL,
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    applicationName: 'BuildLog',
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    creator: 'Anshul Soni',
    formatDetection: {
        telephone: true,
        date: true,
        address: true,
        email: true,
    },
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
