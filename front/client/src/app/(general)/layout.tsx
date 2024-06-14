import Navbar from "@/components/global/Navbar"
import ContactBox from "@/components/global/ContactBox"
import Footer from "@/components/global/Footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <ContactBox className="translate-y-16"/>
      <Footer />
    </>
  )
}
