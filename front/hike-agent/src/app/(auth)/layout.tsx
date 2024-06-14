import AuthBg from "@/assets/images/auth.png"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`flex h-screen items-center justify-center`}
      style={{
        backgroundImage: `url(${AuthBg.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      {children}
    </div>
  )
}
