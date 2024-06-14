import BookingCardLoading from "@/components/bookings/BookingCardLoading"

export default function LoadingHikeookingsPage() {
  return (
    <main className="py-10">
      <section className="page-container page-container-sm font-dm-sans">
        <h1 className="pb-6 text-4xl font-bold">Your hike bookings</h1>
        <ul className="grid grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <li key={i}>
              <BookingCardLoading />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
