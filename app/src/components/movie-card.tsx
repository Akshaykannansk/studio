"use client";

import type { Movie } from '@/types/filmfriend';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MoreHorizontal, Bookmark, History, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary group">
      <Link href={`/dashboard/movies/${movie.id}`} className="block">
        <CardHeader className="p-0 relative">
          <Image
            src={movie.posterUrl || "https://placehold.co/300x450.png"}
            alt={`Poster for ${movie.title}`}
            width={300}
            height={450}
            className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint="movie poster"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </CardHeader>
      </Link>
      
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleActionClick}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={handleActionClick}>
            <DropdownMenuItem>
              <Bookmark className="mr-2 h-4 w-4" />
              <span>Add to Watchlist</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              <span>Log Movie</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Heart className="mr-2 h-4 w-4" />
              <span>Like Movie</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="p-4 flex-grow">
        <Link href={`/dashboard/movies/${movie.id}`} className="block">
          <CardTitle className="text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
            {movie.title}
          </CardTitle>
          {movie.year && (
            <p className="text-sm text-muted-foreground">{movie.year}</p>
          )}
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/dashboard/movies/${movie.id}`} className="flex-grow flex items-center gap-1 text-sm text-muted-foreground">
          {movie.averageRating !== undefined && (
             <>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{movie.averageRating.toFixed(1)}</span>
            </>
          )}
        </Link>
        {movie.watchStatus && (
          <Badge variant="secondary" className="ml-auto">{movie.watchStatus}</Badge>
        )}
      </CardFooter>
    </Card>
  );
}
