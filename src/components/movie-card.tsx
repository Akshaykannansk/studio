import type { Movie } from '@/types/filmfriend';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:border-primary">
        <CardHeader className="p-0 relative">
          <Image
            src={movie.posterUrl || "https://placehold.co/300x450.png"}
            alt={`Poster for ${movie.title}`}
            width={300}
            height={450}
            className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint="movie poster"
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
            {movie.title}
          </CardTitle>
          {movie.year && (
            <p className="text-sm text-muted-foreground">{movie.year}</p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {movie.averageRating !== undefined && (
             <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{movie.averageRating.toFixed(1)}</span>
            </div>
          )}
           {movie.watchStatus && (
            <Badge variant="secondary" className="ml-auto">{movie.watchStatus}</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
