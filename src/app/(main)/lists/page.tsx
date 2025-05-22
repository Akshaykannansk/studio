import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MovieList, User } from '@/types/filmfriend';
import { PlusCircle, Eye, Lock, Users, ThumbsUp, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data
const mockUser: User = {
  id: '1',
  username: 'cinephile_jane',
  name: 'Jane Doe',
};

const mockLists: MovieList[] = [
  { id: 'list1', name: 'Sci-Fi Masterpieces', description: 'A collection of the greatest science fiction films ever made.', owner: mockUser, movies: [{id: 'm1', title: 'Blade Runner', posterUrl: 'https://placehold.co/100x150.png?text=1'}, {id: 'm2', title: '2001: A Space Odyssey', posterUrl: 'https://placehold.co/100x150.png?text=2'}, {id: 'm3', title: 'The Matrix', posterUrl: 'https://placehold.co/100x150.png?text=3'}], isPublic: true, likesCount: 120, commentsCount: 15, createdAt: '2023-01-15', updatedAt: '2023-02-20' },
  { id: 'list2', name: 'Mind-Bending Thrillers', description: 'Movies that will keep you on the edge of your seat and questioning reality.', owner: mockUser, movies: [{id: 'm4', title: 'Inception', posterUrl: 'https://placehold.co/100x150.png?text=4'}, {id: 'm5', title: 'Shutter Island', posterUrl: 'https://placehold.co/100x150.png?text=5'}], isPublic: true, likesCount: 95, commentsCount: 8, createdAt: '2023-03-10', updatedAt: '2023-03-10' },
  { id: 'list3', name: 'Comfort Movies', description: 'My go-to films for a cozy night in.', owner: mockUser, movies: [{id: 'm6', title: 'Paddington 2', posterUrl: 'https://placehold.co/100x150.png?text=6'}, {id: 'm7', title: 'Spirited Away', posterUrl: 'https://placehold.co/100x150.png?text=7'}, {id: 'm8', title: 'School of Rock', posterUrl: 'https://placehold.co/100x150.png?text=8'}, {id: 'm9', title: 'LOTR', posterUrl: 'https://placehold.co/100x150.png?text=9'}], isPublic: false, likesCount: 20, commentsCount: 2, createdAt: '2023-05-01', updatedAt: '2023-06-11' },
];

export default function ListsPage() {
  return (
    <div>
      <PageHeader title="My Movie Lists" description="Curate and share your collections of films.">
        <Button asChild>
          <Link href="/lists/create"><PlusCircle className="mr-2 h-4 w-4" /> Create New List</Link>
        </Button>
      </PageHeader>
      <div className="container mx-auto p-4 md:p-6">
        {mockLists.length === 0 ? (
          <div className="text-center py-10">
            <List className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No lists yet!</h3>
            <p className="text-muted-foreground mb-4">Create your first movie list to get started.</p>
            <Button asChild>
              <Link href="/lists/create"><PlusCircle className="mr-2 h-4 w-4" /> Create New List</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLists.map((list) => (
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
        )}
      </div>
    </div>
  );
}
