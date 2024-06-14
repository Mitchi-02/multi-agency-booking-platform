import Link from "next/link"
import Logo from "@/assets/logo.svg"
import { ReactNode } from "react"

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-primary-gray transition-all duration-200 ease-in-out hover:text-primary-black hover:underline"
    >
      {children}
    </Link>
  )
}

export default function Footer() {
  const servicesLinks = [
    {
      title: "Travel Planning",
      href: "/planning"
    },
    {
      title: "Hiking Adventures",
      href: "/hikes"
    },
    {
      title: "Custom Trips",
      href: "/customTrips"
    },
    {
      title: "Group Expiditions",
      href: "/groupExpiditions"
    },
    {
      title: "Destination Guides",
      href: "/guides"
    }
  ]
  const supportLinks = [
    {
      title: "FAQ",
      href: "/faq"
    },
    {
      title: "Contact Us",
      href: "/contact"
    },
    {
      title: "Feedback",
      href: "/feedback"
    },
    {
      title: "Terms & Condition",
      href: "/terms"
    },
    {
      title: "Privacy Policy",
      href: "/policy"
    }
  ]
  const businessLinks = [
    {
      title: "Partnerships",
      href: "/partnerships"
    },
    {
      title: "Advertising",
      href: "/ads"
    },
    {
      title: "Affiliate Program",
      href: "/affiliate"
    },
    {
      title: "Careers",
      href: "/careers"
    }
  ]
  return (
    <footer className="bg-[#F4F5F6] pb-10 pt-36 font-dm-sans">
      <div className="page-container mx-auto max-w-[66rem]">
        <nav className="grid grid-cols-9 gap-10 pb-20">
          {/* Right */}
          <section className="col-span-3">
            <Link href="/" className="flex items-center gap-3">
              <Logo width={30} />
              <span className="text-xl font-bold">TripX</span>
            </Link>{" "}
            <p className="pt-7 text-base !leading-8 text-primary-gray">
              Our platform connects you to the best in hiking and travel, ensuring unforgettable journeys for every
              explorer. Start your adventure today with TripX!
            </p>
          </section>
          {/* Services */}
          <section className="col-span-2">
            <h4 className="text-2xl font-medium">Services</h4>
            <ul className="mt-5 flex flex-col justify-between gap-4">
              {servicesLinks.map((link, index) => (
                <li key={index}>
                  <FooterLink href={link.href}>{link.title}</FooterLink>
                </li>
              ))}
            </ul>
          </section>
          {/* Support */}
          <section className="col-span-2">
            <h4 className="text-2xl font-medium">Support</h4>
            <ul className="mt-5 flex flex-col justify-between gap-4">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <FooterLink href={link.href}>{link.title}</FooterLink>
                </li>
              ))}
            </ul>
          </section>
          {/* Business */}
          <section className="col-span-2">
            <h4 className="text-2xl font-medium">Business</h4>
            <ul className="mt-5 flex flex-col justify-between gap-4">
              {businessLinks.map((link, index) => (
                <li key={index}>
                  <FooterLink href={link.href}>{link.title}</FooterLink>
                </li>
              ))}
            </ul>
          </section>
        </nav>
        <p className="text-center text-xl text-primary-gray">Copyright 2024 Dragos Team. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
