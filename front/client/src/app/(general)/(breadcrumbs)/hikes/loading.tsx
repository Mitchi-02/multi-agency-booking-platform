import SearchForm from "@/components/global/booking/SearchForm"
import HikeCardLoading from "@/components/hikes/HikeCardLoading"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingHikesPage() {
  return (
    <main className="pt-16">
      <section>
        <SearchForm page="hike" />
      </section>
      <section className="page-container flex gap-6 py-16 font-dm-sans">
        <aside className="min-w-fit basis-[18rem]">
          <Skeleton className="h-full" />
        </aside>
        <section className="grow">
          <ul className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <li key={i}>
                <HikeCardLoading />
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}
