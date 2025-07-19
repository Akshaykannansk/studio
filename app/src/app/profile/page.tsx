"use client";

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
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// This is a dynamic component because it depends on the activity type
const activityIcons: Record<string, React.ReactElement> = {
    watched: <Eye className="h-5 w-5 text-primary mt-1" />,
    liked: <Heart className="h-5 w-5 text-red-500 mt-1" />,
    list_created: <List className="h-5 w-5 text-accent mt-1" />,
    reviewed: <MessageSquare className="h-5 w-5 text-green-500 mt-1" />,
    watchlist: <Bookmark className="h-5 w-5 text-blue-500 mt-1" />,
};

type ActivityLog = {type: 'watched' | 'liked' | 'list_created' | 'reviewed' | 'watchlist', item: any, date: string};

function ActivityFeed() {
    const { data: activity, error } = useSWR<ActivityLog[]>('/api/users/1/activity', fetcher);
    
    const activityText = (activity: ActivityLog): string => {
        const { type, item } = activity;
        switch(type) {
            case 'watched': return `Watched ${item.title}`;
            case 'liked': return `Liked ${item.title}`;
            case 'list_created': return `Created list: ${item.name}`;
            case 'reviewed': return `Reviewed ${item.movie.title}`;
            case 'watchlist': return `Added ${item.title} to their watchlist`;
            default: return 'Unknown activity';
        }
    }

    if (error) return <p className="text-destructive">Failed to load activity.</p>;
    if (!activity) return <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;
    
    return (
        <div className="space-y-4">
            {activity.map((act, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border-b last:border-b-0">
                {activityIcons[act.type]}
                <div>
                <p className="text-sm">{activityText(act)}</p>
                <p className="text-xs text-muted-foreground">{new Date(act.date).toLocaleDateString()}</p>
                </div>
            </div>
            ))}
        </div>
    )
}

function UserLists() {
    const { data: lists, error } = useSWR<MovieListType[]>('/api/users/1/lists', fetcher);
    if(error) return <p className="text-destructive">Failed to load lists.</p>;
    if(!lists) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;

    return (
        <div className="space-y-4">
            {lists.length > 0 ? lists.map(list => (
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
            )) : <p className="text-muted-foreground">No lists created yet.</p>}
        </div>
    )
}

function UserReviews() {
     const { data: reviews, error } = useSWR<ReviewType[]>('/api/users/1/reviews', fetcher);
    if(error) return <p className="text-destructive">Failed to load reviews.</p>;
    if(!reviews) return <div className="space-y-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>;

    return (
         <div className="space-y-6">
            {reviews.length > 0 ? reviews.map(review => (
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
            )) : <p className="text-muted-foreground">No reviews written yet.</p>}
        </div>
    )
}

function ProfilePageSkeleton() {
    return (
         <div>
            <PageHeader title={<Skeleton className="h-8 w-48" />} description={<Skeleton className="h-4 w-32" />}>
                <Skeleton className="h-9 w-32" />
            </PageHeader>
             <div className="container mx-auto p-4 md:p-6 space-y-8">
                <Card>
                    <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <div className="flex-1 w-full space-y-3">
                            <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-3/4" />
                            <div className="flex gap-6 pt-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
             </div>
        </div>
    )
}

export default function ProfilePage() {
    // In a real app, user ID would come from auth context.
    const { data: user, error } = useSWR<User>('/api/users/1/profile', fetcher);

    if (error) return <div className="p-6 text-center text-destructive">Failed to load user profile.</div>
    if (!user) return <ProfilePageSkeleton />;

  return (
    <div>
      <PageHeader title={user.name || user.username} description={`@${user.username}`}>
        <Button variant="outline"><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</Button>
      </PageHeader>
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <Card>
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarImage src={user.avatarUrl} alt={user.name || user.username} data-ai-hint="profile avatar large" />
              <AvatarFallback className="text-4xl">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <p className="text-muted-foreground">{user.bio}</p>
              <div className="mt-4 flex justify-center md:justify-start gap-6 text-sm">
                <div className="text-center"><strong className="block text-foreground text-lg">{user.followersCount || 0}</strong><span>Followers</span></div>
                <div className="text-center"><strong className="block text-foreground text-lg">{user.followingCount || 0}</strong><span>Following</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Favorite Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.favoriteMovies?.map((movie) => (
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
             {(user.favoriteMovies?.length || 0) === 0 && <p className="text-muted-foreground col-span-full">No favorite movies selected yet.</p>}
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
              <CardContent><ActivityFeed /></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lists">
            <Card>
              <CardHeader><CardTitle>My Lists</CardTitle></CardHeader>
              <CardContent><UserLists /></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card>
              <CardHeader><CardTitle>My Reviews</CardTitle></CardHeader>
              <CardContent><UserReviews /></CardContent>
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
