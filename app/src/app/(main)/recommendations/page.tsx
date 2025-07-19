"use client";

import { useState, useEffect } from 'react';
import { MovieCard } from '@/components/movie-card';
import { PageHeader } from '@/components/page-header';
import type { Movie } from '@/types/filmfriend';
import { ThumbsUp, Users, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


type SimilarUser = {
    username: string;
    reason: string;
}

// This is a mock function. In a real app, you'd search your movie database.
const findMovieByTitle = async (title: string): Promise<Movie | null> => {
    // Simulate API call
    await new Promise(res => setTimeout(res, 50)); 
    const mockDb: Movie[] = [
        { id: 'rec1', title: 'Everything Everywhere All at Once', year: 2022, posterUrl: 'https://placehold.co/300x450.png?text=EEAAO', averageRating: 4.7, dataAiHint: "multiverse action" },
        { id: 'rec2', title: 'The Lighthouse', year: 2019, posterUrl: 'https://placehold.co/300x450.png?text=Lighthouse', averageRating: 4.1, dataAiHint: "psychological horror" },
        { id: 'rec3', title: 'Portrait of a Lady on Fire', year: 2019, posterUrl: 'https://placehold.co/300x450.png?text=Lady+On+Fire', averageRating: 4.6, dataAiHint: "french romance" },
        { id: 'rec4', title: 'Mad Max: Fury Road', year: 2015, posterUrl: 'https://placehold.co/300x450.png?text=Mad+Max', averageRating: 4.5, dataAiHint: "post apocalyptic" },
        { id: 'rec5', title: 'Parasite', year: 2019, posterUrl: 'https://placehold.co/300x450.png?text=Parasite', averageRating: 4.6, dataAiHint: "korean thriller" },
    ];
    const found = mockDb.find(m => m.title.toLowerCase() === title.toLowerCase());
    return found || { id: `new-${title.replace(/\s+/g, '')}`, title: title, posterUrl: `https://placehold.co/300x450.png?text=${title.replace(/\s+/g, '+')}`, dataAiHint: "movie poster"};
}


export default function RecommendationsPage() {
    const { toast } = useToast();
    const [watchNext, setWatchNext] = useState<Movie[]>([]);
    const [similarUsers, setSimilarUsers] = useState<SimilarUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRecommendations = async () => {
        setIsLoading(true);
        setWatchNext([]);
        setSimilarUsers([]);
        
        // This is where you would call your FastAPI backend.
        const recommendationInput = {
            userProfile: {
                watchedMovies: [{ title: 'Inception', year: 2010 }, { title: 'The Matrix', year: 1999 }, {title: 'Pulp Fiction'}],
                likedMovies: [{ title: 'Interstellar', year: 2014 }, {title: 'Parasite'}],
                movieLists: [
                    { name: 'Sci-Fi Masterpieces', movies: [{ title: 'Blade Runner 2049' }, { title: 'Dune' }] }
                ],
                tasteDescription: "Loves mind-bending sci-fi, intense thrillers, and critically acclaimed foreign films.",
            },
        };

        try {
            console.log("Would send this to FastAPI for WATCH_NEXT:", {...recommendationInput, recommendationType: 'WATCH_NEXT'});
            // Simulating API call for Watch Next
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockMovieTitles = ["The Lighthouse", "Mad Max: Fury Road", "Parasite"];
            const moviePromises = mockMovieTitles.map(findMovieByTitle);
            const resolvedMovies = (await Promise.all(moviePromises)).filter((m): m is Movie => m !== null);
            setWatchNext(resolvedMovies);


            console.log("Would send this to FastAPI for SIMILAR_USERS:", {...recommendationInput, recommendationType: 'SIMILAR_USERS'});
            // Simulating API call for Similar Users
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockSimilarUsers: SimilarUser[] = [
                { username: "@Cosmic_Critic", reason: "Shares your love for grand-scale sci-fi epics and complex narratives." },
                { username: "@Noir_Nights", reason: "Appreciates stylish thrillers and isn't afraid of a little ambiguity." }
            ];
            setSimilarUsers(mockSimilarUsers);

            toast({ title: "Recommendations Loaded (Simulated)", description: "This is mock data. Connect to your backend." });

        } catch (error) {
            console.error("Error getting recommendations:", error);
            toast({ title: "Error", description: "Could not generate recommendations.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch recommendations on component mount
    useEffect(() => {
        fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <div>
      <PageHeader title="Personalized Recommendations" description="Discover movies and friends tailored to your taste.">
          <Button onClick={fetchRecommendations} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Refresh Recommendations
          </Button>
      </PageHeader>
      <div className="container mx-auto p-4 md:p-6 space-y-10">
        
        {isLoading && (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg text-muted-foreground">Finding your next favorite movie...</p>
            </div>
        )}
        
        {!isLoading && (
            <>
                <section>
                    <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
                        <ThumbsUp className="mr-3 h-7 w-7 text-primary" />
                        What to Watch Next
                    </h2>
                    {watchNext.length > 0 ? (
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
                     {similarUsers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarUsers.map((user, index) => (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={`https://placehold.co/100x100.png?text=${user.username.substring(1,3)}`} data-ai-hint="profile avatar" />
                                            <AvatarFallback>{user.username.substring(1,3).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{user.username}</CardTitle>
                                            <CardDescription>Potential Film Friend</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground italic border-l-2 pl-3">"{user.reason}"</p>
                                        <Button className="mt-4 w-full">View Profile</Button>
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
