"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { MovieCard } from '@/components/movie-card';
import type { Movie, TMDbMovieResult } from '@/types/filmfriend';
import { Loader2, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';

// In a real app, you would use an environment variable for the API key.
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function LandingPage() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPopularMovies = async () => {
      if (!TMDB_API_KEY) {
        toast({ title: "Configuration Error", description: "TMDB API Key is not configured.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // In a real app, this fetch would go to your Next.js backend, which then calls TMDB.
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1&include_adult=false`);
        if (!response.ok) {
          throw new Error('Failed to fetch popular movies');
        }
        const data = await response.json();
        const movies = data.results.slice(0, 18).map((movie: TMDbMovieResult) => ({
          id: movie.id.toString(),
          title: movie.title,
          year: movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : undefined,
          posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/300x450.png?text=No+Image',
          overview: movie.overview,
          averageRating: movie.vote_average ? movie.vote_average / 2 : undefined, // Convert 10-scale to 5-scale
          dataAiHint: "movie poster",
        }));
        setPopularMovies(movies);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Could not fetch popular movies.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">FilmFriend</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild>
                <Link href="/dashboard">Login</Link>
            </Button>
            <Button variant="outline">
                Sign Up
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <PageHeader 
          title="Welcome to FilmFriend" 
          description="Your ultimate companion for discovering, tracking, and sharing movies you love."
        />
        <div className="container mx-auto p-4 md:p-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Popular Movies Right Now</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : popularMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {popularMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg bg-card">
              <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Could not load movies</h3>
              <p className="text-muted-foreground">There was an issue fetching popular movies. Please try again later.</p>
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-background border-t">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by You, Powered by AI.
              </p>
          </div>
      </footer>
    </div>
  );
}
