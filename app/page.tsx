import { HomePageClient } from "./components/home-page-client";
import { getFeaturedBook } from "./lib/audiobooks";
import { getCatalogBooks } from "./lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const books = await getCatalogBooks();
  const featuredBook = books[0] ?? getFeaturedBook();

  return <HomePageClient books={books} featuredBook={featuredBook} />;
}
