import { getTravelDetails } from "@/api/travel"
import TravelPresentation from "@/components/travel"
import getQueryClient from "@/lib/query.server"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"

export default async function TravelPage({ params: { id } }: { params: { id: string } }) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["travelDetails", id],
    queryFn: () => getTravelDetails(id)
  })

  return (
    <main className="pt-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TravelPresentation id={id} />
      </HydrationBoundary>
    </main>
  )
}
