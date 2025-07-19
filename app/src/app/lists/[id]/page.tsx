"use client"; 

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { Movie, MovieList, User } from '@/types/filmfriend';
import { Edit3, PlusCircle, Share2, ThumbsUp, MessageSquare, Trash2, Search, Loader2, Lightbulb, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '@/components/movie-card';
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
import useSWR, { useSWRConfig } from 'swr';
import { Skeleton } from '@/components/ui/skeleton';


const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ListDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const listUrl = `/api/lists/${params.id}`;

  const { data: list, error: listError } = useSWR<MovieList>(listUrl, fetcher);

  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleGetSuggestions = async () => {
    if(!list) return;
    setIsLoadingSuggestions(true);
    
    try {
      const res = await fetch(`/api/lists/${list.id}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           listName: list.name,
           listMovies: list.movies.map(m => ({ title: m.title, year: m.year })),
        })
      });

      if (!res.ok) throw new Error('Failed to fetch suggestions');
      
      const suggestions = await res.json();
      setSuggestedMovies(suggestions);
      toast({ title: "Suggestions Loaded", description: "AI has recommended some movies for you." });

    } catch (error) {
      toast({ title: "Error", description: "Could not fetch AI suggestions.", variant: "destructive" });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleAddMovieToList = async (movie: Movie) => {
    if(!list) return;
    try {
      // API call to add movie to list
      const res = await fetch(`/api/lists/${list.id}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: movie.id })
      });
      if(!res.ok) throw new Error("Failed to add movie");
      
      // Optimistic update with SWR
      mutate(listUrl, (currentList: MovieList | undefined) => {
        if (!currentList) return;
        return { ...currentList, movies: [...currentList.movies, movie] };
      }, false);

      toast({ title: "Movie Added", description: `${movie.title} has been added to the list.`});
      setSuggestedMovies(prev => prev.filter(m => m.id !== movie.id));
    } catch (error) {
      toast({ title: "Error", description: "Could not add movie to the list.", variant: "destructive"});
    }
  }

  const handleRemoveMovie = async (movieId: string, movieTitle: string) => {
    if(!list) return;
     try {
      // API call to remove movie from list
      const res = await fetch(`/api/lists/${list.id}/movies/${movieId}`, { method: 'DELETE' });
      if(!res.ok) throw new Error("Failed to remove movie");
      
      // Optimistic update with SWR
      mutate(listUrl, (currentList: MovieList | undefined) => {
        if (!currentList) return;
        return { ...currentList, movies: currentList.movies.filter(m => m.id !== movieId) };
      }, false);
      
      toast({ title: "Movie Removed", description: `${movieTitle} has been removed from the list.` });
    } catch (error) {
      toast({ title: "Error", description: "Could not remove movie.", variant: "destructive"});
    }
  }
  
  if (listError) return <div className="p-6">Failed to load list. Please try again.</div>;
  if (!list) return (
     <div>
      <PageHeader title={<Skeleton className="h-8 w-64" />} description={<Skeleton className="h-4 w-48" />}>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </PageHeader>
      <div className="container mx-auto p-4 md:p-6"><Skeleton className="h-64 w-full" /></div>
    </div>
  );

  return (
    <div>
      <PageHeader title={list.name} description={`A list by @${list.owner.username}`}>
        <div className="flex gap-2">
          <Button variant="outline" asChild size="sm">
            <Link href="/lists"><ArrowLeft className="mr-2 h-4 w-4" /> All Lists</Link>
          </Button>
          <Button variant="outline" size="sm"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          <Button size="sm"><Edit3 className="mr-2 h-4 w-4" /> Edit List</Button>
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
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Movies in this List ({list.movies.length})</h2>
            </div>
            {list.movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {list.movies.map((movie) => (
                  <div key={movie.id} className="relative group">
                    <MovieCard movie={movie} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8">
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
                          <AlertDialogAction onClick={() => handleRemoveMovie(movie.id, movie.title)}>Remove</AlertDialogAction>
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

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="text-yellow-400" /> AI Suggestions</CardTitle>
                <CardDescription>Get suggestions for this list from your backend.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleGetSuggestions} disabled={isLoadingSuggestions} className="w-full mb-4">
                  {isLoadingSuggestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Get Suggestions
                </Button>
                {suggestedMovies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Recommended for you:</h4>
                    {suggestedMovies.map((movie, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                        <span className="text-sm font-medium">{movie.title}</span>
                        <Button size="sm" variant="outline" onClick={() => handleAddMovieToList(movie)}>
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
                </CardContent>
            </Card>

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
