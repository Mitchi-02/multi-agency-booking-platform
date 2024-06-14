import { getHikeDetails } from "@/api/hike"
import HikePresentation from "@/components/hike"
import getQueryClient from "@/lib/query.server"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"

export default async function HikePage({ params: { id } }: { params: { id: string } }) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["hikeDetails", id],
    queryFn: () => getHikeDetails(id)
  })

  return (
    <main className="pt-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HikePresentation id={id} />
      </HydrationBoundary>
    </main>
  )
}
