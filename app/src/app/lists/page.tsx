"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MovieList } from '@/types/filmfriend';
import { PlusCircle, Eye, Lock, Users, ThumbsUp, MessageSquare, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function ListsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
            ))}
        </div>
    )
}

export default function ListsPage() {
  // In a real app, user id would come from auth context
  const { data: lists, error } = useSWR<MovieList[]>('/api/users/1/lists', fetcher);

  return (
    <div>
      <PageHeader title="My Movie Lists" description="Curate and share your collections of films.">
        <Button asChild>
          <Link href="/lists/create"><PlusCircle className="mr-2 h-4 w-4" /> Create New List</Link>
        </Button>
      </PageHeader>
      <div className="container mx-auto p-4 md:p-6">
        {error && <p className="text-destructive text-center">Failed to load your lists.</p>}
        {!lists && !error && <ListsSkeleton />}
        {lists && (
          lists.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-card">
              <List className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No lists yet!</h3>
              <p className="text-muted-foreground mb-4">Create your first movie list to get started.</p>
              <Button asChild>
                <Link href="/lists/create"><PlusCircle className="mr-2 h-4 w-4" /> Create New List</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list) => (
                <Link key={list.id} href={`/lists/${list.id}`} className="block group">
                  <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">{list.name}</CardTitle>
                          {list.isPublic ? (
                              <Badge variant="outline" className="flex items-center gap-1"><Eye className="h-3 w-3"/> Public</Badge>
                          ) : (
                              <Badge variant="secondary" className="flex items-center gap-1"><Lock className="h-3 w-3"/> Private</Badge>
                          )}
                      </div>
                      {list.description && <CardDescription className="mt-1 line-clamp-2">{list.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {list.movies.length > 0 ? (
                        <div className="flex -space-x-4 rtl:space-x-reverse">
                          {list.movies.slice(0, 4).map((movie, index) => (
                            <Image
                              key={movie.id}
                              src={movie.posterUrl || "https://placehold.co/50x75.png"}
                              alt={movie.title}
                              width={50}
                              height={75}
                              className="h-[75px] w-[50px] rounded object-cover border-2 border-card group-hover:border-primary/20 transition-colors"
                              style={{ zIndex: list.movies.length - index }}
                              data-ai-hint="mini movie poster"
                            />
                          ))}
                           {list.movies.length > 4 && (
                              <div className="flex items-center justify-center h-[75px] w-[50px] rounded bg-muted text-muted-foreground text-xs font-medium border-2 border-card group-hover:border-primary/20">
                                  +{list.movies.length - 4}
                              </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">This list is empty.</p>
                      )}
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground flex justify-between items-center">
                      <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{list.owner.name || list.owner.username}</span> • <span>{list.movies.length} films</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5"><ThumbsUp className="h-3 w-3" /> {list.likesCount}</span>
                          <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" /> {list.commentsCount}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
