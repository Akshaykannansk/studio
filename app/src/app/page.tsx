"use client";

import { MovieCard } from '@/components/movie-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import type { Movie, MovieList, User } from '@/types/filmfriend';
import { ArrowRight, Film, List, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data to be replaced with dynamic data
const mockRecentlyWatched: Movie[] = [
  { id: '1', title: 'Inception', year: 2010, posterUrl: 'https://placehold.co/300x450.png?text=Inception', averageRating: 4.9, watchStatus: 'watched', dataAiHint: "sci-fi thriller" },
  { id: '2', title: 'The Matrix', year: 1999, posterUrl: 'https://placehold.co/300x450.png?text=The+Matrix', averageRating: 4.8, watchStatus: 'rewatched', dataAiHint: "action sci-fi" },
  { id: '3', title: 'Interstellar', year: 2014, posterUrl: 'https://placehold.co/300x450.png?text=Interstellar', averageRating: 4.7, dataAiHint: "space drama" },
];

const mockPopularLists: MovieList[] = [
    {id: 'list1', name: 'Sci-Fi Masterpieces', movies: [], owner: { id: '2', username: 'scififan' }, isPublic: true, createdAt: '2023-01-01', updatedAt: '2023-01-01', likesCount: 101, commentsCount: 12 },
    {id: 'list2', name: 'Mind-Bending Thrillers', movies: [], owner: { id: '3', username: 'thrillerseeker' }, isPublic: true, createdAt: '2023-01-01', updatedAt: '2023-01-01', likesCount: 99, commentsCount: 8 },
    {id: 'list3', name: 'Comfort Movies', movies: [], owner: { id: '4', username: 'cozyfilms' }, isPublic: true, createdAt: '2023-01-01', updatedAt: '2023-01-01', likesCount: 250, commentsCount: 45 },
];

const mockRecommendations: Movie[] = [
  { id: '4', title: 'Parasite', year: 2019, posterUrl: 'https://placehold.co/300x450.png?text=Parasite', averageRating: 4.6, dataAiHint: "korean thriller" },
  { id: '5', title: 'Everything Everywhere All at Once', year: 2022, posterUrl: 'https://placehold.co/300x450.png?text=EEAAO', averageRating: 4.7, dataAiHint: "multiverse action" },
];


export default function DashboardPage() {
  console.log("[DATA FETCH] Loading dashboard data from mock data sources.");
  const recentlyWatched = mockRecentlyWatched;
  const popularLists = mockPopularLists;
  const recommendations = mockRecommendations;

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
          {recentlyWatched ? (
             recentlyWatched.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {recentlyWatched.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-10 border rounded-lg bg-card">
                    <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">No Recent Activity</h3>
                    <p className="text-muted-foreground">Go watch some movies!</p>
                </div>
            )
          ) : (
            <div>Loading...</div>
          )}
        </section>

        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold tracking-tight">Popular Lists</h2>
                <Button variant="link" asChild>
                <Link href="/lists">Explore Lists <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
             {popularLists ? (
                popularLists.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {popularLists.map(list => (
                            <Link key={list.id} href={`/lists/${list.id}`} className="block group">
                                <div className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-medium group-hover:text-primary">{list.name}</h3>
                                    <p className="text-sm text-muted-foreground">{list.movies.length} movies</p>
                                    <p className="text-xs text-muted-foreground mt-1">By @{list.owner.username}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 border rounded-lg bg-card">
                        <List className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">No Popular Lists</h3>
                        <p className="text-muted-foreground">Check back later for popular collections.</p>
                    </div>
                )
             ) : (
                <div>Loading...</div>
             )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">New Recommendations</h2>
            <Button variant="link" asChild>
              <Link href="/recommendations">More Recommendations <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
            {recommendations ? (
                recommendations.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {recommendations.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 border rounded-lg bg-card">
                        <ThumbsUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">We're learning your taste!</h3>
                        <p className="text-muted-foreground">Watch and rate more movies to get personalized recommendations.</p>
                    </div>
                )
            ) : (
              <div>Loading...</div>
            )}
        </section>
      </div>
    </div>
  );
}
