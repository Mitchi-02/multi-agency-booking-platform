import SearchForm from "@/components/global/booking/SearchForm"
import TravelCardLoading from "@/components/travels/TravelCardLoading"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingTravelsPage() {
  return (
    <main className="pt-16">
      <section>
        <SearchForm page="travel" />
      </section>
      <section className="page-container flex gap-6 py-16 font-dm-sans">
        <aside className="min-w-fit basis-[18rem]">
          <Skeleton className="h-full" />
        </aside>
        <section className="grow">
          <ul className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <li key={i}>
                <TravelCardLoading />
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}
