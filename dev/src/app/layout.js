import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/NavBar";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PayScore",
  description: "Upload CSV files to get predictions using ML models.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 dark:bg-neutral-900`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 mt-16 bg-stone-200">{children}</main>
            <footer className="w-full text-center py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm text-sm text-neutral-600 dark:text-neutral-400">
              &copy;{new Date().getFullYear()} PayScore
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
