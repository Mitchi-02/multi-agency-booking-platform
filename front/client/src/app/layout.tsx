import type { Metadata } from "next"
import { Poppins, DM_Sans } from "next/font/google"
import "@/styles/globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import QueryClientProvider from "@/providers/QueryClientProvider"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-poppins" })
const dm_sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dm-sans" })

export const metadata: Metadata = {
  title: "Tripx",
  description: "Tripx Website",
  icons: {
    icon: "/logo.svg"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} font-normal text-primary-black ${poppins.variable} ${dm_sans.variable} bg-main_bg`}
      >
        <QueryClientProvider>{children}</QueryClientProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
