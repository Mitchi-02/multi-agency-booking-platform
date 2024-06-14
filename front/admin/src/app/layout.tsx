import { Inter, Open_Sans } from "next/font/google"
import "@/styles/globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import QueryClientProvider from "@/providers/QueryClientProvider"
import { Metadata } from "next"

const open_sans = Open_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-open-sans" })
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Tripx Admin",
  description: "Tripx Admin Website",
  icons: {
    icon: "/logo.svg"
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${inter.variable} ${open_sans.variable} text-primary-black min-h-[100dvh] bg-[#F4F4F4]`}
      >
        <QueryClientProvider>{children}</QueryClientProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
