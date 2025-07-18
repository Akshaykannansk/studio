"use client"; // For form handling and state

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/movie-card';
import type { Movie, TMDbMovieResult } from '@/types/filmfriend';
import { SearchIcon, Loader2, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function MovieSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { toast } = useToast();

  const fetchDefaultMovies = async () => {
    if (!TMDB_API_KEY) {
      toast({ title: "Configuration Error", description: "TMDB API Key is not configured.", variant: "destructive" });
      setIsLoading(false);
      setInitialLoad(false);
      return;
    }
    setIsLoading(true);
    try {
      // IMPORTANT: This is a placeholder for a backend call. 
      // Direct API calls from the client are not secure for keys.
      // In a real app, this fetch would go to your Next.js backend, which then calls TMDB.
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1&include_adult=false`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      const movies = data.results.slice(0, 12).map((movie: TMDbMovieResult) => ({
        id: movie.id.toString(),
        title: movie.title,
        year: movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : undefined,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/300x450.png?text=No+Image',
        overview: movie.overview,
        tmdbId: movie.id.toString(),
        averageRating: movie.vote_average ? movie.vote_average / 2 : undefined,
        dataAiHint: "movie poster"
      }));
      setResults(movies);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Could not fetch movies.", variant: "destructive" });
      setResults([]);
    } finally {
      setIsLoading(false);
      setInitialLoad(false);
    }
  };
  
  useEffect(() => {
    fetchDefaultMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
        fetchDefaultMovies(); // if search is cleared, show popular again
        return;
    }
    if (!TMDB_API_KEY) {
      toast({ title: "Configuration Error", description: "TMDB API Key is not configured.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setInitialLoad(false);
    try {
      // IMPORTANT: Placeholder for backend call.
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(searchTerm)}&page=1&include_adult=false`);
      if (!response.ok) {
        throw new Error('Failed to search movies');
      }
      const data = await response.json();
      const movies = data.results.map((movie: TMDbMovieResult) => ({
        id: movie.id.toString(),
        title: movie.title,
        year: movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : undefined,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/300x450.png?text=No+Image',
        overview: movie.overview,
        tmdbId: movie.id.toString(),
        averageRating: movie.vote_average ? movie.vote_average / 2 : undefined,
        dataAiHint: "movie poster"
      }));
      setResults(movies);
       if (movies.length === 0) {
        toast({ title: "No Results", description: `No movies found for "${searchTerm}".` });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Search Error", description: "Could not perform search.", variant: "destructive" });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Search Movies" description="Find any movie from our extensive database." />
      <div className="container mx-auto p-4 md:p-6">
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <Input
            type="search"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
            aria-label="Search movies"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Search</span>
          </Button>
        </form>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((movie) => (
               <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
        
        {!isLoading && results.length === 0 && !initialLoad && (
            <div className="text-center py-10">
                <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No movies found</h3>
                <p className="text-muted-foreground">Try a different search term or check for typos.</p>
            </div>
        )}

         {!isLoading && results.length === 0 && initialLoad && searchTerm === '' && (
            <div className="text-center py-10">
                <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Discover Movies</h3>
                <p className="text-muted-foreground">Popular movies are shown here. Use the search bar above to find specific titles.</p>
            </div>
        )}
      </div>
    </div>
  );
}
