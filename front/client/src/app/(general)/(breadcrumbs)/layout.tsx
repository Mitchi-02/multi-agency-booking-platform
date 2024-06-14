import BreadCrumbs from "@/components/global/BreadCrumbs"
import routes from "@/routes"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadCrumbs routes={routes} className="page-container page-container-sm pt-14" />
      {children}
    </>
  )
}
