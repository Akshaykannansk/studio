"use client"; // For AI suggestions interaction

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { Movie, MovieList, User } from '@/types/filmfriend';
import { Edit3, PlusCircle, Share2, ThumbsUp, MessageSquare, Trash2, Search, Loader2, Lightbulb, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '@/components/movie-card';
import { getRecommendations, type RecommendationInput } from '@/ai/flows/recommendation-engine';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';

// Mock data
const mockOwner: User = {
  id: '1',
  username: 'cinephile_jane',
  name: 'Jane Doe',
};

const mockMoviesInList: Movie[] = [
  { id: 'm1', title: 'Blade Runner 2049', year: 2017, posterUrl: 'https://placehold.co/300x450.png?text=Blade+Runner', averageRating: 4.5, dataAiHint: "sci-fi action" },
  { id: 'm2', title: 'Arrival', year: 2016, posterUrl: 'https://placehold.co/300x450.png?text=Arrival', averageRating: 4.3, dataAiHint: "alien film" },
  { id: 'm3', title: 'Dune', year: 2021, posterUrl: 'https://placehold.co/300x450.png?text=Dune', averageRating: 4.4, dataAiHint: "epic sci-fi" },
];

const mockList: MovieList = {
  id: 'list1',
  name: 'Modern Sci-Fi Gems',
  description: 'A curated collection of thought-provoking and visually stunning science fiction films from recent years.',
  owner: mockOwner,
  movies: mockMoviesInList,
  isPublic: true,
  likesCount: 150,
  commentsCount: 25,
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
};

export default function ListDetailPage({ params }: { params: { id: string } }) {
  // In a real app, fetch list data using params.id
  const list = mockList; // Using mock data
  const { toast } = useToast();

  const [suggestedMovies, setSuggestedMovies] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setSuggestedMovies([]);
    try {
      const input: RecommendationInput = {
        recommendationType: 'LIST_SUGGESTIONS',
        userProfile: {
            watchedMovies: [{title: 'Inception'}, {title: 'The Matrix'}],
            likedMovies: [{title: 'Interstellar'}],
            movieLists: [],
            tasteDescription: "I enjoy thought-provoking sci-fi with strong visuals and complex characters.",
        },
        context: {
          listName: list.name,
          listMovies: list.movies.map(m => ({ title: m.title, year: m.year })),
        }
      };
      const result = await getRecommendations(input);
      const suggestions = result.suggestedMovies || [];
      setSuggestedMovies(suggestions);
      if (suggestions.length === 0) {
        toast({ title: "No new suggestions", description: "AI couldn't find any new suggestions for this list right now." });
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({ title: "Error", description: "Could not generate movie suggestions.", variant: "destructive" });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Placeholder for adding a movie to the list
  const handleAddMovieToList = (movieTitle: string) => {
    console.log(`Adding ${movieTitle} to list`);
    toast({ title: "Movie Added (Simulated)", description: `${movieTitle} would be added to the list.`});
    setSuggestedMovies(prev => prev.filter(title => title !== movieTitle)); // Remove from suggestions
  }

  // Placeholder for removing a movie from the list
  const handleRemoveMovie = (movieId: string) => {
    console.log(`Removing movie ${movieId} from list`);
    toast({ title: "Movie Removed (Simulated)", description: `Movie ${movieId} would be removed.` });
    // Here you would update the list.movies state
  }

  return (
    <div>
      <PageHeader title={list.name} description={`A list by @${list.owner.username}`}>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/lists"><ArrowLeft className="mr-2 h-4 w-4" /> All Lists</Link>
          </Button>
          <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          <Button><Edit3 className="mr-2 h-4 w-4" /> Edit List</Button>
        </div>
      </PageHeader>

      <div className="container mx-auto p-4 md:p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{list.name}</CardTitle>
            {list.description && <CardDescription className="text-base mt-1">{list.description}</CardDescription>}
            <div className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <span>Created by <Link href={`/profile/${list.owner.username}`} className="text-primary hover:underline">{list.owner.name || list.owner.username}</Link></span>
              <span>{list.movies.length} films</span>
              <span>{list.isPublic ? 'Public List' : 'Private List'}</span>
              <span>Last updated: {new Date(list.updatedAt).toLocaleDateString()}</span>
            </div>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Button variant="ghost" size="sm"><ThumbsUp className="mr-2 h-4 w-4" /> {list.likesCount} Likes</Button>
            <Button variant="ghost" size="sm"><MessageSquare className="mr-2 h-4 w-4" /> {list.commentsCount} Comments</Button>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content: Movies in List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Movies in this List ({list.movies.length})</h2>
              {/* Add Movie Search/Button could go here */}
            </div>
            {list.movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {list.movies.map((movie) => (
                  <div key={movie.id} className="relative group">
                    <MovieCard movie={{...movie, posterUrl: `${movie.posterUrl}`}} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will remove "{movie.title}" from the list. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveMovie(movie.id)}>Remove</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-10 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="text-lg">This list is empty</CardTitle>
                <CardDescription>Add movies to start building your collection.</CardDescription>
                <Button className="mt-4"><PlusCircle className="mr-2 h-4 w-4" /> Add Movies</Button>
              </Card>
            )}
          </div>

          {/* Sidebar: AI Suggestions & Add Movie */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="text-yellow-400" /> AI Suggestions</CardTitle>
                <CardDescription>Discover movies you might like to add to this list.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleGetSuggestions} disabled={isLoadingSuggestions} className="w-full mb-4">
                  {isLoadingSuggestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Get Suggestions
                </Button>
                {suggestedMovies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Recommended for you:</h4>
                    {suggestedMovies.map((title, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                        <span className="text-sm font-medium">{title}</span>
                        <Button size="sm" variant="outline" onClick={() => handleAddMovieToList(title)}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {!isLoadingSuggestions && suggestedMovies.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">Click above to generate suggestions.</p>
                )}
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Add Movie</CardTitle>
                    <CardDescription>Search and add a movie to this list.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input placeholder="Search movie to add..." />
                        <Button><Search className="h-4 w-4" /></Button>
                    </div>
                    {/* Search results would appear here */}
                </CardContent>
            </Card>

            {/* Comments Section (Placeholder) */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Comments ({list.commentsCount})</CardTitle></CardHeader>
              <CardContent>
                <Textarea placeholder="Write a comment..." className="mb-2" />
                <Button>Post Comment</Button>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">Comments will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
