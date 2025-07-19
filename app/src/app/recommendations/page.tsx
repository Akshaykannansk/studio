"use client";

import { useState } from 'react';
import { MovieCard } from '@/components/movie-card';
import { PageHeader } from '@/components/page-header';
import type { Movie } from '@/types/filmfriend';
import { ThumbsUp, Users, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';


type SimilarUser = {
    id: string;
    username: string;
    avatarUrl?: string;
    reason: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

function RecommendationsSkeleton() {
    return (
        <div className="space-y-10">
            <section>
                 <Skeleton className="h-8 w-72 mb-6" />
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[300px] w-full" />)}
                 </div>
            </section>
             <section>
                 <Skeleton className="h-8 w-72 mb-6" />
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
                 </div>
            </section>
        </div>
    )
}


export default function RecommendationsPage() {
    const { toast } = useToast();
    
    // In a real app, user ID comes from auth context.
    const { data: watchNext, error: watchNextError, mutate: mutateWatchNext } = useSWR<Movie[]>('/api/users/1/recommendations/movies', fetcher);
    const { data: similarUsers, error: similarUsersError, mutate: mutateSimilarUsers } = useSWR<SimilarUser[]>('/api/users/1/recommendations/users', fetcher);
    const [isLoading, setIsLoading] = useState(false);
    
    const refreshRecommendations = async () => {
        setIsLoading(true);
        try {
            // Trigger re-fetch for both endpoints
            await Promise.all([
                mutateWatchNext(),
                mutateSimilarUsers()
            ]);
            toast({ title: "Refreshed!", description: "Your recommendations have been updated." });
        } catch (error) {
            toast({ title: "Error", description: "Could not refresh recommendations.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    const hasError = watchNextError || similarUsersError;
    const isLoadingFirstTime = (!watchNext && !watchNextError) || (!similarUsers && !similarUsersError);

  return (
    <div>
      <PageHeader title="Personalized Recommendations" description="Discover movies and friends tailored to your taste.">
          <Button onClick={refreshRecommendations} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Refresh Recommendations
          </Button>
      </PageHeader>
      <div className="container mx-auto p-4 md:p-6 space-y-10">
        
        {isLoadingFirstTime && !hasError && <RecommendationsSkeleton />}
        {hasError && <p className="text-destructive text-center">Could not load recommendations. Please try again later.</p>}
        
        {!isLoadingFirstTime && !hasError && (
            <>
                <section>
                    <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
                        <ThumbsUp className="mr-3 h-7 w-7 text-primary" />
                        What to Watch Next
                    </h2>
                    {watchNext && watchNext.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {watchNext.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
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

                <section>
                    <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
                        <Users className="mr-3 h-7 w-7 text-accent" />
                        Find Your Film Friends
                    </h2>
                     {similarUsers && similarUsers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarUsers.map((user) => (
                                <Card key={user.id}>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png?text=${user.username.substring(0,2)}`} data-ai-hint="profile avatar" />
                                            <AvatarFallback>{user.username.substring(0,2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{user.username}</CardTitle>
                                            <CardDescription>Potential Film Friend</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground italic border-l-2 pl-3">"{user.reason}"</p>
                                        <Button className="mt-4 w-full" asChild><Link href={`/profile/${user.id}`}>View Profile</Link></Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                     ) : (
                         <div className="text-center py-10 border rounded-lg bg-card">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">No similar users found yet</h3>
                            <p className="text-muted-foreground">Keep rating movies to help us find your community.</p>
                        </div>
                     )}
                </section>
            </>
        )}

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
