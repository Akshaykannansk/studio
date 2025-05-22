import { MovieCard } from '@/components/movie-card';
import { PageHeader } from '@/components/page-header';
import type { Movie } from '@/types/filmfriend';
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock data for genre movies
const mockGenreMovies: Movie[] = [
  { id: 'genre1', title: 'Action Movie Alpha', year: 2023, posterUrl: 'https://placehold.co/300x450.png?text=Action+Alpha', averageRating: 4.2, dataAiHint: "action movie" },
  { id: 'genre2', title: 'Action Packed Bravo', year: 2022, posterUrl: 'https://placehold.co/300x450.png?text=Action+Bravo', averageRating: 4.0, dataAiHint: "explosion film" },
  { id: 'genre3', title: 'Thriller Chase Charlie', year: 2021, posterUrl: 'https://placehold.co/300x450.png?text=Thriller+Charlie', averageRating: 4.5, dataAiHint: "suspense movie" },
  { id: 'genre4', title: 'Sci-Fi Epic Delta', year: 2020, posterUrl: 'https://placehold.co/300x450.png?text=SciFi+Delta', averageRating: 4.6, dataAiHint: "space opera" },
  { id: 'genre5', title: 'Comedy Fun Echo', year: 2023, posterUrl: 'https://placehold.co/300x450.png?text=Comedy+Echo', averageRating: 3.9, dataAiHint: "funny movie" },
  { id: 'genre6', title: 'Drama Story Foxtrot', year: 2022, posterUrl: 'https://placehold.co/300x450.png?text=Drama+Foxtrot', averageRating: 4.8, dataAiHint: "emotional film" },
];

// Helper function to get movies for a genre (mock implementation)
const getMoviesByGenre = (genreName: string): Movie[] => {
  // In a real app, this would fetch from your backend.
  // This mock filters based on title or a predefined genre list.
  return mockGenreMovies.filter(movie => 
    movie.title.toLowerCase().includes(genreName.toLowerCase()) ||
    (movie.genres && movie.genres.map(g => g.toLowerCase()).includes(genreName.toLowerCase())) ||
    mockGenreMovies.indexOf(movie) < 3 // Fallback to show some movies if no direct match
  ).slice(0, 12); // Limit to 12 results
};

export default function GenrePage({ params }: { params: { genreName: string } }) {
  const genreName = decodeURIComponent(params.genreName);
  const moviesInGenre = getMoviesByGenre(genreName);

  return (
    <div>
      <PageHeader 
        title={`${genreName.charAt(0).toUpperCase() + genreName.slice(1)} Movies`}
        description={`Browse films in the ${genreName} genre.`}
      >
        <Button variant="outline" asChild>
          <Link href="/recommendations"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Recommendations</Link>
        </Button>
      </PageHeader>
      <div className="container mx-auto p-4 md:p-6">
        {moviesInGenre.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {moviesInGenre.map((movie) => (
              <MovieCard key={movie.id} movie={{...movie, posterUrl: `${movie.posterUrl}&aihint=${movie.dataAiHint || 'genre movie'}`}} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg bg-card">
            <Tag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No movies found for "{genreName}"</h3>
            <p className="text-muted-foreground">Try exploring other genres or use the main search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// This function helps Next.js to know which dynamic routes to pre-render if needed (optional for purely dynamic)
// export async function generateStaticParams() {
//   const genres = ['action', 'comedy', 'drama', 'horror', 'sci-fi', 'thriller', 'romance', 'animation', 'documentary'];
//   return genres.map((genreName) => ({
//     genreName,
//   }));
// }
