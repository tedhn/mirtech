import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/hooks/getQueryClient";
import UsersPage from "./(pages)/users/page";

export default function Home() {
  const queryClient = getQueryClient();

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UsersPage />
      </HydrationBoundary>
    </main>
  );
}
