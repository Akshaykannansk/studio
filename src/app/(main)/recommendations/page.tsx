import { MovieCard } from '@/components/movie-card';
import { PageHeader } from '@/components/page-header';
import type { Movie } from '@/types/filmfriend';
import { ThumbsUp } from 'lucide-react';

// Mock data
const mockRecommendedMovies: Movie[] = [
  { id: 'rec1', title: 'Everything Everywhere All at Once', year: 2022, posterUrl: 'https://placehold.co/300x450.png?text=EEAAO', averageRating: 4.7, dataAiHint: "multiverse action" },
  { id: 'rec2', title: 'The Lighthouse', year: 2019, posterUrl: 'https://placehold.co/300x450.png?text=Lighthouse', averageRating: 4.1, dataAiHint: "psychological horror" },
  { id: 'rec3', title: 'Portrait of a Lady on Fire', year: 2019, posterUrl: 'https://placehold.co/300x450.png?text=Lady+On+Fire', averageRating: 4.6, dataAiHint: "french romance" },
  { id: 'rec4', title: 'Mad Max: Fury Road', year: 2015, posterUrl: 'https://placehold.co/300x450.png?text=Mad+Max', averageRating: 4.5, dataAiHint: "post apocalyptic" },
  { id: 'rec5', title: 'Spider-Man: Into the Spider-Verse', year: 2018, posterUrl: 'https://placehold.co/300x450.png?text=SpiderVerse', averageRating: 4.8, dataAiHint: "animated superhero" },
  { id: 'rec6', title: 'Parasite', year: 2019, posterUrl: 'https://placehold.co/300x450.png?text=Parasite', averageRating: 4.6, dataAiHint: "korean thriller" },
];

const becauseYouWatched: { reason: Movie, recommendations: Movie[] }[] = [
    {
        reason: { id: 'watched1', title: 'Inception', posterUrl: 'https://placehold.co/300x450.png?text=Inception', dataAiHint: "sci-fi thriller" },
        recommendations: mockRecommendedMovies.slice(0,3)
    },
    {
        reason: { id: 'watched2', title: 'Hereditary', posterUrl: 'https://placehold.co/300x450.png?text=Hereditary', dataAiHint: "horror film" },
        recommendations: mockRecommendedMovies.slice(3,5)
    }
];

export default function RecommendationsPage() {
  return (
    <div>
      <PageHeader title="Personalized Recommendations" description="Discover movies tailored to your taste." />
      <div className="container mx-auto p-4 md:p-6 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
            <ThumbsUp className="mr-3 h-7 w-7 text-primary" />
            Movies For You
          </h2>
          {mockRecommendedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {mockRecommendedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={{...movie, posterUrl: `${movie.posterUrl}&aihint=${movie.dataAiHint || 'movie poster'}`}} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg bg-card">
              <ThumbsUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">We're learning your taste!</h3>
              <p className="text-muted-foreground">Watch and rate more movies to get personalized recommendations.</p>
            </div>
          )}
        </section>

        {becauseYouWatched.map((section, index) => (
            <section key={`byw-${index}`}>
                <h2 className="text-2xl font-semibold tracking-tight mb-6">
                    Because you watched <Link href={`/movies/${section.reason.id}`} className="text-primary hover:underline">{section.reason.title}</Link>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {section.recommendations.map((movie) => (
                        <MovieCard key={`${section.reason.id}-${movie.id}`} movie={{...movie, id: `${section.reason.id}-${movie.id}`, posterUrl: `${movie.posterUrl}&aihint=${movie.dataAiHint || 'movie poster'}`}} />
                    ))}
                </div>
            </section>
        ))}

        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Explore by Genre
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary'].map(genre => (
                <Link key={genre} href={`/movies/genre/${genre.toLowerCase()}`}>
                    <span className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
                        {genre}
                    </span>
                </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
