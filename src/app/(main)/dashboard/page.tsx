import { MovieCard } from '@/components/movie-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import type { Movie } from '@/types/filmfriend';
import { PlusCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockMovies: Movie[] = [
  { id: '1', title: 'Inception', year: 2010, posterUrl: 'https://placehold.co/300x450.png?text=Inception', averageRating: 4.9, watchStatus: 'watched', dataAiHint: "sci-fi thriller" },
  { id: '2', title: 'The Matrix', year: 1999, posterUrl: 'https://placehold.co/300x450.png?text=The+Matrix', averageRating: 4.8, watchStatus: 'rewatched', dataAiHint: "action sci-fi" },
  { id: '3', title: 'Interstellar', year: 2014, posterUrl: 'https://placehold.co/300x450.png?text=Interstellar', averageRating: 4.7, dataAiHint: "space drama" },
  { id: '4', title: 'Parasite', year: 2019, posterUrl: 'https://placehold.co/300x450.png?text=Parasite', averageRating: 4.6, watchStatus: 'want-to-watch', dataAiHint: "korean thriller" },
];

const mockLists = [
    {id: 'list1', name: 'Sci-Fi Masterpieces', movieCount: 23, ownerName: 'Jane Doe'},
    {id: 'list2', name: 'Mind-Bending Thrillers', movieCount: 15, ownerName: 'John Smith'},
    {id: 'list3', name: 'Comfort Movies', movieCount: 42, ownerName: 'Alice Green'},
]

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Welcome back, Jane!" description="Here's what's new in your FilmFriend world." />
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">Recently Watched</h2>
            <Button variant="link" asChild>
              <Link href="/profile?tab=activity">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {mockMovies.slice(0,4).map((movie) => (
              <MovieCard key={movie.id} movie={{...movie, posterUrl: `${movie.posterUrl}&aihint=${movie.dataAiHint || 'movie poster'}`}} />
            ))}
          </div>
        </section>

        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold tracking-tight">Popular Lists</h2>
                <Button variant="link" asChild>
                <Link href="/lists">Explore Lists <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {mockLists.map(list => (
                    <Link key={list.id} href={`/lists/${list.id}`} className="block group">
                        <div className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-medium group-hover:text-primary">{list.name}</h3>
                            <p className="text-sm text-muted-foreground">{list.movieCount} movies</p>
                            <p className="text-xs text-muted-foreground mt-1">By @{list.ownerName.toLowerCase().replace(' ','')}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">New Recommendations</h2>
            <Button variant="link" asChild>
              <Link href="/recommendations">More Recommendations <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {mockMovies.slice(2,6).reverse().map((movie) => ( // Just re-using some mock movies
              <MovieCard key={movie.id} movie={{...movie, id: `rec-${movie.id}`, posterUrl: `${movie.posterUrl}&aihint=${movie.dataAiHint || 'movie poster'}`}} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
