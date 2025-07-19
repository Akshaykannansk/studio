"use client";

import { MovieCard } from '@/components/movie-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import type { Movie, MovieList } from '@/types/filmfriend';
import { ArrowRight, Film, List, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function SectionSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ListSectionSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                 <Skeleton key={i} className="h-24 w-full" />
            ))}
        </div>
    )
}

export default function DashboardPage() {
  // In a real app, the user ID would come from an auth context
  const { data: recentlyWatched, error: watchedError } = useSWR<Movie[]>('/api/users/1/recently-watched', fetcher);
  const { data: popularLists, error: listsError } = useSWR<MovieList[]>('/api/lists/popular', fetcher);
  const { data: recommendations, error: recsError } = useSWR<Movie[]>('/api/users/1/recommendations', fetcher);

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
          {!recentlyWatched && !watchedError && <SectionSkeleton />}
          {watchedError && <p className="text-destructive">Failed to load recently watched movies.</p>}
          {recentlyWatched && (
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
          )}
        </section>

        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold tracking-tight">Popular Lists</h2>
                <Button variant="link" asChild>
                <Link href="/lists">Explore Lists <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
             {!popularLists && !listsError && <ListSectionSkeleton />}
             {listsError && <p className="text-destructive">Failed to load popular lists.</p>}
             {popularLists && (
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
             )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">New Recommendations</h2>
            <Button variant="link" asChild>
              <Link href="/recommendations">More Recommendations <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
            {!recommendations && !recsError && <SectionSkeleton />}
            {recsError && <p className="text-destructive">Failed to load recommendations.</p>}
            {recommendations && (
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
            )}
        </section>
      </div>
    </div>
  );
}
