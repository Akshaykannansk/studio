"use client";

import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Movie, Review as ReviewType } from '@/types/filmfriend';
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
import { likeMovieAction, setWatchStatusAction } from '@/app/actions/movie-actions';
import type { WatchStatus } from '@/types/filmfriend';


// Mock data for a single movie
const mockMovie: Movie = {
  id: '335983', // TMDB ID for Blade Runner 2049
  title: 'Blade Runner 2049',
  year: 2017,
  posterUrl: 'https://placehold.co/400x600.png?text=Blade+Runner+2049',
  overview: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
  genres: ['Sci-Fi', 'Thriller', 'Action'],
  director: 'Denis Villeneuve',
  cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas', 'Sylvia Hoeks', 'Robin Wright'],
  averageRating: 4.5,
  userRating: 4.0, // Example user rating
  watchStatus: 'watched',
  isLiked: false, // Example like status
  dataAiHint: "cyberpunk future"
};

const mockReviews: ReviewType[] = [
  { id: 'r1', user: { id: 'u1', username: 'critic101', name: 'Alex Reviewer', avatarUrl: 'https://placehold.co/40x40.png?text=AR' }, movie: mockMovie, rating: 5, text: 'A stunning visual masterpiece with a thought-provoking narrative. Villeneuve has outdone himself.', createdAt: '2023-10-26', likesCount: 152, isPublic: true },
  { id: 'r2', user: { id: 'u2', username: 'moviebuff_22', name: 'Sarah Lee', avatarUrl: 'https://placehold.co/40x40.png?text=SL' }, movie: mockMovie, rating: 4.5, text: 'Loved the atmosphere and cinematography. The pacing was a bit slow at times, but overall a fantastic film.', createdAt: '2023-10-24', likesCount: 88, isPublic: true },
];

const mockSimilarMovies: Movie[] = [
  { id: 'sim1', title: 'Blade Runner', year: 1982, posterUrl: 'https://placehold.co/300x450.png?text=Blade+Runner', averageRating: 4.6, dataAiHint: "original classic" },
  { id: 'sim2', title: 'Arrival', year: 2016, posterUrl: 'https://placehold.co/300x450.png?text=Arrival', averageRating: 4.3, dataAiHint: "alien communication" },
  { id: 'sim3', title: 'Dune', year: 2021, posterUrl: 'https://placehold.co/300x450.png?text=Dune', averageRating: 4.4, dataAiHint: "desert planet" },
  { id: 'sim4', title: 'Ex Machina', year: 2014, posterUrl: 'https://placehold.co/300x450.png?text=Ex+Machina', averageRating: 4.2, dataAiHint: "artificial intelligence" },
];


function ReviewForm({ movie, onReviewSubmit }: { movie: Movie, onReviewSubmit: () => void }) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    
    // This is where you would call your FastAPI backend.
    const reviewData = {
      movieId: formData.get('movieId') as string,
      movieTitle: formData.get('movieTitle') as string,
      rating: parseFloat(formData.get('rating') as string),
      text: formData.get('reviewText') as string,
      isPublic: formData.get('isPublic') === 'on',
    }
    console.log('[ACTION] Would submit review to FastAPI:', reviewData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    toast({
      title: 'Review Submitted (Simulated)',
      description: "Your review would be saved to your backend.",
    });
    onReviewSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="movieId" value={movie.id} />
      <input type="hidden" name="movieTitle" value={movie.title} />
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


export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // In a real app, this would be fetched from the DB, including user interaction data.
  console.log(`[DATA FETCH] Loading movie details for id '${params.id}' from mock data.`);
  const [movie, setMovie] = useState<Movie>(mockMovie);

  const handleLike = async () => {
    const newLikedStatus = !movie.isLiked;
    
    // Optimistically update UI
    setMovie(m => ({ ...m, isLiked: newLikedStatus }));
    toast({ title: newLikedStatus ? 'Liked!' : 'Unliked', description: `${movie.title} has been updated.` });
    
    // This is where you would call your FastAPI backend.
    startTransition(async () => {
      console.log(`[ACTION] Call FastAPI to like movie ${movie.id} (isLiked: ${newLikedStatus})`);
      await likeMovieAction(movie.id, newLikedStatus); // This now just logs to console
    });
  }
  
  const handleSetWatchStatus = async (status: WatchStatus) => {
      const originalStatus = movie.watchStatus;
      const newStatus = movie.watchStatus === status ? undefined : status;
      
      // Optimistically update UI
      setMovie(m => ({ ...m, watchStatus: newStatus }));
      toast({ title: 'Status Updated', description: `${movie.title} status set to ${newStatus || 'none'}.` });

      // This is where you would call your FastAPI backend.
      startTransition(async () => {
          console.log(`[ACTION] Call FastAPI to set status for ${movie.id} to ${newStatus}`);
          await setWatchStatusAction(movie.id, newStatus); // This now just logs to console
      });
  }

  const [hasReviewed, setHasReviewed] = useState(false); // mock state
  
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
                priority // Prioritize loading main movie poster
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
                            disabled={isPending}
                        >
                            <Heart className={cn("h-6 w-6", movie.isLiked && "fill-current")} />
                            <span className="text-xs mt-1">Like</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            className={cn("flex flex-col h-auto p-2", movie.watchStatus === 'watched' && "text-primary")}
                            onClick={() => handleSetWatchStatus('watched')}
                            disabled={isPending}
                        >
                            <Eye className="h-6 w-6" />
                            <span className="text-xs mt-1">Watched</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            className={cn("flex flex-col h-auto p-2", movie.watchStatus === 'want-to-watch' && "text-primary")}
                            onClick={() => handleSetWatchStatus('want-to-watch')}
                            disabled={isPending}
                        >
                            <Bookmark className="h-6 w-6" />
                            <span className="text-xs mt-1">Watchlist</span>
                        </Button>
                         <Button 
                            variant="ghost" 
                            className={cn("flex flex-col h-auto p-2", hasReviewed && "text-primary")}
                            disabled={isPending}
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
                    <ReviewForm movie={movie} onReviewSubmit={() => setHasReviewed(true)} />
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
              </CardHeader>
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
                    {/* Add more crew if available */}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews">
                <Card>
                  <CardHeader><CardTitle>User Reviews ({mockReviews.length})</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    {mockReviews.map((review) => (
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
                    {mockReviews.length === 0 && <p className="text-muted-foreground">No reviews yet for this movie.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details">
                <Card>
                  <CardHeader><CardTitle>Additional Details</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Release Year:</strong> {movie.year}</p>
                    <p><strong>TMDB ID:</strong> {params.id}</p>
                    {/* Add more details like runtime, language, country etc. */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Separator className="my-8 md:my-12" />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Similar Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {mockSimilarMovies.map((simMovie) => (
              <MovieCard key={simMovie.id} movie={{...simMovie, posterUrl: `${simMovie.posterUrl}&aihint=${simMovie.dataAiHint || 'movie poster'}`}} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
