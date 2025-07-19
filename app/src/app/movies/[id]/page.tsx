"use client";

import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Movie, Review as ReviewType, WatchStatus } from '@/types/filmfriend';
import { Eye, Bookmark, Film, Heart, MessageSquare, PlusCircle, Star as StarIcon, ThumbsUp, UserCircle, History, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MovieCard } from '@/components/movie-card';
import { StarRating } from '@/components/star-rating';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import useSWR, { useSWRConfig } from 'swr';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// This component is extracted to handle its own state and API calls.
function ReviewForm({ movie, onReviewSubmit }: { movie: Movie, onReviewSubmit: () => void }) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    
    const reviewData = {
      movieId: movie.id,
      rating: parseFloat(formData.get('rating') as string),
      text: formData.get('reviewText') as string,
      isPublic: formData.get('isPublic') === 'on',
    }
    
    try {
        const res = await fetch(`/api/movies/${movie.id}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if(!res.ok) throw new Error("Failed to submit review");

        toast({ title: 'Review Submitted!', description: "Your review has been saved." });
        onReviewSubmit(); // This will trigger a re-fetch of reviews
    } catch (error) {
        toast({ title: 'Error', description: "Could not submit your review.", variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="rating" value={rating} />
      <div>
        <Label>Your Rating:</Label>
        <StarRating rating={rating} onRatingChange={setRating} size={24} />
      </div>
      <Textarea name="reviewText" placeholder={`What are your thoughts on ${movie.title}?`} rows={4} required />
      <div className="flex items-center space-x-2">
        <Checkbox id="isPublic" name="isPublic" defaultChecked />
        <Label htmlFor="isPublic" className="text-sm font-normal">Make review public</Label>
      </div>
      <Button type="submit" className="w-full" disabled={rating === 0 || isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Review'}
      </Button>
    </form>
  )
}

function MoviePageSkeleton() {
    return (
        <div>
            <PageHeader title={<Skeleton className="h-8 w-3/4" />} description={<Skeleton className="h-4 w-1/2" />} />
            <div className="container mx-auto p-4 md:p-6">
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    <div className="md:col-span-1 space-y-6">
                        <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                        <Skeleton className="w-full h-48 rounded-lg" />
                        <Skeleton className="w-full h-64 rounded-lg" />
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="w-full h-40 rounded-lg" />
                        <Skeleton className="w-full h-96 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { mutate } = useSWRConfig();

  const movieUrl = `/api/movies/${params.id}`;
  const reviewsUrl = `/api/movies/${params.id}/reviews`;
  const similarUrl = `/api/movies/${params.id}/similar`;

  const { data: movie, error: movieError } = useSWR<Movie>(movieUrl, fetcher);
  const { data: reviews, error: reviewsError, mutate: mutateReviews } = useSWR<ReviewType[]>(reviewsUrl, fetcher);
  const { data: similarMovies, error: similarError } = useSWR<Movie[]>(similarUrl, fetcher);

  const handleLike = async () => {
    if(!movie) return;
    const newLikedStatus = !movie.isLiked;

    // Optimistically update UI
    mutate(movieUrl, (currentMovie: Movie | undefined) => {
        if (!currentMovie) return;
        return {...currentMovie, isLiked: newLikedStatus };
    }, false);

    toast({ title: newLikedStatus ? 'Liked!' : 'Unliked', description: `${movie.title} has been updated.` });
    
    // Trigger API call
    try {
        await fetch(`/api/movies/${movie.id}/like`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isLiked: newLikedStatus })
        });
        mutate(movieUrl); // Revalidate to get final state from server
    } catch(err) {
        toast({ title: 'Error', description: 'Could not update like status.', variant: 'destructive'});
        // Revert optimistic update on failure
        mutate(movieUrl, (currentMovie: any) => ({...currentMovie, isLiked: !newLikedStatus }), false);
    }
  }
  
  const handleSetWatchStatus = async (status: WatchStatus) => {
      if(!movie) return;
      const originalStatus = movie.watchStatus;
      const newStatus = movie.watchStatus === status ? undefined : status;
      
      // Optimistic update UI
      mutate(movieUrl, (currentMovie: Movie | undefined) => {
        if(!currentMovie) return;
        return { ...currentMovie, watchStatus: newStatus };
      }, false);

      toast({ title: 'Status Updated', description: `${movie.title} status set to ${newStatus || 'none'}.` });

      try {
        await fetch(`/api/movies/${movie.id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        mutate(movieUrl);
      } catch(err) {
        toast({ title: 'Error', description: 'Could not update watch status.', variant: 'destructive'});
        mutate(movieUrl, (currentMovie: any) => ({...currentMovie, watchStatus: originalStatus }), false);
      }
  }

  if (movieError) return <div className="p-6 text-center text-destructive">Failed to load movie details.</div>
  if (!movie) return <MoviePageSkeleton />;
  
  return (
    <div>
      <PageHeader title={movie.title} description={`${movie.year} • Directed by ${movie.director}`} />
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Poster and Actions */}
          <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden shadow-lg relative">
              <Image
                src={movie.posterUrl || "https://placehold.co/400x600.png"}
                alt={`Poster for ${movie.title}`}
                width={400}
                height={600}
                className="w-full h-auto object-cover"
                data-ai-hint={movie.dataAiHint}
                priority 
              />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><History className="w-5 h-5 text-primary" /> Log, Rate, Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex justify-around gap-2 flex-wrap">
                        <Button 
                            variant="ghost" 
                            className={cn("flex flex-col h-auto p-2", movie.isLiked && "text-red-500")}
                            onClick={handleLike}
                        >
                            <Heart className={cn("h-6 w-6", movie.isLiked && "fill-current")} />
                            <span className="text-xs mt-1">Like</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            className={cn("flex flex-col h-auto p-2", movie.watchStatus === 'watched' && "text-primary")}
                            onClick={() => handleSetWatchStatus('watched')}
                        >
                            <Eye className="h-6 w-6" />
                            <span className="text-xs mt-1">Watched</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            className={cn("flex flex-col h-auto p-2", movie.watchStatus === 'want-to-watch' && "text-primary")}
                            onClick={() => handleSetWatchStatus('want-to-watch')}
                        >
                            <Bookmark className="h-6 w-6" />
                            <span className="text-xs mt-1">Watchlist</span>
                        </Button>
                         <Button 
                            variant="ghost" 
                            className={cn("flex flex-col h-auto p-2")}
                        >
                            <MessageSquare className="h-6 w-6" />
                            <span className="text-xs mt-1">Review</span>
                        </Button>
                    </div>
                    <Separator />
                    <Button variant="secondary" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add to List</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-xl">Write a Review</CardTitle></CardHeader>
                <CardContent>
                    <ReviewForm movie={movie} onReviewSubmit={() => mutateReviews()} />
                </CardContent>
            </Card>
          </div>

          {/* Right Column: Details and Tabs */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl">{movie.title}</CardTitle>
                        <CardDescription className="text-base">{movie.year} • Directed by {movie.director}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-xl font-semibold">
                        <StarIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        <span>{movie.averageRating?.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground ml-1">( TMDb )</span>
                    </div>
                </div>
              </Header>
              <CardContent>
                <p className="text-base leading-relaxed mb-4">{movie.overview}</p>
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="cast_crew" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
                <TabsTrigger value="cast_crew">Cast & Crew</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="details">More Details</TabsTrigger>
              </TabsList>
              <TabsContent value="cast_crew">
                <Card>
                  <CardHeader><CardTitle>Cast</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {movie.cast?.map((actor) => (
                        <li key={actor} className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-muted-foreground" /> <span>{actor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <Separator className="my-4" />
                  <CardHeader><CardTitle>Crew</CardTitle></CardHeader>
                  <CardContent>
                     <p className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-muted-foreground" /> <strong>Director:</strong> {movie.director}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews">
                <Card>
                  <CardHeader><CardTitle>User Reviews ({reviews?.length || 0})</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    {!reviews && !reviewsError && Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                    {reviewsError && <p className="text-destructive">Failed to load reviews.</p>}
                    {reviews && reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg bg-background/50">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.user.avatarUrl} alt={review.user.name || review.user.username} data-ai-hint="user avatar" />
                            <AvatarFallback>{review.user.name ? review.user.name.split(' ').map(n=>n[0]).join('') : review.user.username.substring(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                               <div>
                                 <span className="font-semibold">{review.user.name || review.user.username}</span>
                                 <span className="text-xs text-muted-foreground ml-2">@{review.user.username}</span>
                               </div>
                               <StarRating rating={review.rating} size={16} />
                            </div>
                            <p className="text-sm mt-1">{review.text}</p>
                            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-4">
                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                <Button variant="ghost" size="sm" className="p-0 h-auto text-xs">
                                    <ThumbsUp className="h-3 w-3 mr-1" /> {review.likesCount} Likes
                                </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {reviews && reviews.length === 0 && <p className="text-muted-foreground">No reviews yet for this movie.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details">
                <Card>
                  <CardHeader><CardTitle>Additional Details</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Release Year:</strong> {movie.year}</p>
                    <p><strong>TMDB ID:</strong> {params.id}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Separator className="my-8 md:my-12" />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Similar Movies</h2>
           {!similarMovies && !similarError && <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">{Array.from({length:6}).map((_,i) => <Skeleton key={i} className="h-[300px] w-full" />)}</div>}
           {similarError && <p className="text-destructive">Failed to load similar movies.</p>}
           {similarMovies && similarMovies.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {similarMovies.map((simMovie) => (
                  <MovieCard key={simMovie.id} movie={simMovie} />
                ))}
              </div>
           )}
        </section>
      </div>
    </div>
  );
}
