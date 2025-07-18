import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Movie, User, Review as ReviewType, MovieList as MovieListType } from '@/types/filmfriend';
import { Edit3, Film, List, MessageSquare, Heart, Eye, Bookmark, History } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { StarRating } from '@/components/star-rating';

// Mock data
const mockUser: User = {
  id: '1',
  username: 'cinephile_jane',
  name: 'Jane Doe',
  avatarUrl: 'https://placehold.co/200x200.png',
  bio: 'Lover of classic cinema, sci-fi, and everything in between. Trying to watch every movie ever made (almost).',
  followersCount: 1250,
  followingCount: 340,
};

const favoriteMovies: Movie[] = [
  { id: 'fav1', title: 'Pulp Fiction', year: 1994, posterUrl: 'https://placehold.co/200x300.png?text=Pulp+Fiction', dataAiHint: "crime film" },
  { id: 'fav2', title: '2001: A Space Odyssey', year: 1968, posterUrl: 'https://placehold.co/200x300.png?text=Space+Odyssey', dataAiHint: "space epic" },
  { id: 'fav3', title: 'Spirited Away', year: 2001, posterUrl: 'https://placehold.co/200x300.png?text=Spirited+Away', dataAiHint: "anime fantasy" },
  { id: 'fav4', title: 'The Godfather', year: 1972, posterUrl: 'https://placehold.co/200x300.png?text=The+Godfather', dataAiHint: "mafia drama" },
];

const mockActivity: {type: 'watched' | 'liked' | 'list_created' | 'reviewed' | 'watchlist', item: Movie | MovieListType | ReviewType, date: string}[] = [
    { type: 'watched', item: favoriteMovies[0], date: '2 days ago'},
    { type: 'liked', item: favoriteMovies[2], date: '3 days ago'},
    { type: 'list_created', item: { id: 'list1', name: 'My Top 100 Thrillers', movies: [], owner: mockUser, isPublic: true, createdAt: '2023-10-10', updatedAt: '2023-10-10' }, date: '5 days ago'},
    { type: 'reviewed', item: { id: 'rev1', movie: favoriteMovies[1], user: mockUser, rating: 5, text: 'A masterpiece!', isPublic: true, createdAt: '2023-10-08' }, date: '1 week ago'},
    { type: 'watchlist', item: favoriteMovies[3], date: '2 weeks ago'},
];

const mockUserLists: MovieListType[] = [
    { id: 'list10', name: 'Sci-Fi Adventures', movies: favoriteMovies.slice(0,2), owner: mockUser, isPublic: true, createdAt: '2023-01-01', updatedAt: '2023-01-01', likesCount: 15, commentsCount: 3 },
    { id: 'list11', name: 'Must-Watch Animations', movies: [favoriteMovies[2]], owner: mockUser, isPublic: false, createdAt: '2023-02-15', updatedAt: '2023-02-15', likesCount: 5, commentsCount: 1 },
];

const mockUserReviews: ReviewType[] = [
    { id: 'rev10', movie: favoriteMovies[0], user: mockUser, rating: 4.5, text: 'Classic Tarantino, innovative and captivating.', isPublic: true, createdAt: '2023-03-20', likesCount: 22 },
    { id: 'rev11', movie: favoriteMovies[3], user: mockUser, rating: 5, text: 'An offer you can\'t refuse. Perfection.', isPublic: true, createdAt: '2023-04-10', likesCount: 35 },
];

const activityIcons: Record<string, React.ReactElement> = {
    watched: <Eye className="h-5 w-5 text-primary mt-1" />,
    liked: <Heart className="h-5 w-5 text-red-500 mt-1" />,
    list_created: <List className="h-5 w-5 text-accent mt-1" />,
    reviewed: <MessageSquare className="h-5 w-5 text-green-500 mt-1" />,
    watchlist: <Bookmark className="h-5 w-5 text-blue-500 mt-1" />,
};

const activityText: Record<string, (item: any) => string> = {
    watched: (item: Movie) => `Watched ${item.title}`,
    liked: (item: Movie) => `Liked ${item.title}`,
    list_created: (item: MovieListType) => `Created list: ${item.name}`,
    reviewed: (item: ReviewType) => `Reviewed ${item.movie.title}`,
    watchlist: (item: Movie) => `Added ${item.title} to their watchlist`,
};


export default function ProfilePage() {
  return (
    <div>
      <PageHeader title={mockUser.name || mockUser.username} description={`@${mockUser.username}`}>
        <Button variant="outline"><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</Button>
      </PageHeader>
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <Card>
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name || mockUser.username} data-ai-hint="profile avatar large" />
              <AvatarFallback className="text-4xl">
                {mockUser.name ? mockUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : mockUser.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <p className="text-muted-foreground">{mockUser.bio}</p>
              <div className="mt-4 flex justify-center md:justify-start gap-6 text-sm">
                <div className="text-center"><strong className="block text-foreground text-lg">1.2k</strong><span>Followers</span></div>
                <div className="text-center"><strong className="block text-foreground text-lg">340</strong><span>Following</span></div>
                <div className="text-center"><strong className="block text-foreground text-lg">123</strong><span>Films</span></div>
                <div className="text-center"><strong className="block text-foreground text-lg">42</strong><span>Lists</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Favorite Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favoriteMovies.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative">
                <Image
                  src={movie.posterUrl || "https://placehold.co/200x300.png"}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="rounded-lg object-cover aspect-[2/3] w-full transition-all duration-300 ease-in-out group-hover:opacity-75"
                  data-ai-hint={movie.dataAiHint}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                  <span className="text-white text-center p-2 text-sm font-medium">{movie.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-6">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><History /> Recent Activity</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {mockActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border-b last:border-b-0">
                    {activityIcons[activity.type]}
                    <div>
                      <p className="text-sm">{activityText[activity.type](activity.item)}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lists">
            <Card>
              <CardHeader><CardTitle>My Lists</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 {mockUserLists.map(list => (
                    <Link key={list.id} href={`/lists/${list.id}`} className="block group">
                        <div className="bg-secondary p-4 rounded-lg hover:bg-secondary/80 transition-colors">
                            <h3 className="text-md font-medium group-hover:text-primary">{list.name}</h3>
                            <p className="text-sm text-muted-foreground">{list.movies.length} movies - {list.isPublic ? 'Public' : 'Private'}</p>
                            <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                                <span>{list.likesCount} Likes</span>
                                <span>{list.commentsCount} Comments</span>
                            </div>
                        </div>
                    </Link>
                 ))}
                 {mockUserLists.length === 0 && <p className="text-muted-foreground">No lists created yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card>
              <CardHeader><CardTitle>My Reviews</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {mockUserReviews.map(review => (
                    <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-4">
                            <Image src={review.movie.posterUrl || "https://placehold.co/80x120.png"} alt={review.movie.title} width={60} height={90} className="rounded object-cover aspect-[2/3]" data-ai-hint="movie poster small" />
                            <div>
                                <Link href={`/movies/${review.movie.id}`} className="font-semibold hover:underline">{review.movie.title}</Link>
                                <StarRating rating={review.rating} size={16} className="my-1" />
                                <p className="text-sm text-muted-foreground line-clamp-3">{review.text}</p>
                                <p className="text-xs text-muted-foreground mt-2">{new Date(review.createdAt).toLocaleDateString()} - {review.likesCount} likes</p>
                            </div>
                        </div>
                    </div>
                ))}
                {mockUserReviews.length === 0 && <p className="text-muted-foreground">No reviews written yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="followers">
            <Card>
              <CardHeader><CardTitle>Followers</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground">Followers list will be shown here.</p></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="following">
            <Card>
              <CardHeader><CardTitle>Following</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground">Following list will be shown here.</p></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
