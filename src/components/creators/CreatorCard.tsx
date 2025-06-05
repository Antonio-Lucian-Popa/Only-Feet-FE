import React from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface CreatorCardProps {
  creator: Creator;
  isSubscribed?: boolean;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, isSubscribed }) => {
  return (
    <Card className="creator-card overflow-hidden">
      {creator.coverPhoto && (
        <div 
          className="h-24 bg-cover bg-center" 
          style={{ backgroundImage: `url(${creator.coverPhoto})` }}
        />
      )}
      <CardContent className={`pt-6 pb-4 ${!creator.coverPhoto ? 'pt-6' : '-mt-10'}`}>
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={creator.profilePicture} alt={creator.username} />
            <AvatarFallback>{creator.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className="mt-4 font-semibold text-xl">{creator.username}</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {creator.subscribersCount} {creator.subscribersCount === 1 ? 'subscriber' : 'subscribers'}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-accent/50">
              ${creator.subscriptionPrice}/month
            </Badge>
            <Badge variant="outline">
              {creator.mediaCount} {creator.mediaCount === 1 ? 'photo' : 'photos'}
            </Badge>
            {isSubscribed && (
              <Badge variant="default" className="bg-primary">
                Subscribed
              </Badge>
            )}
          </div>
          {creator.bio && (
            <p className="text-muted-foreground text-sm mt-3 line-clamp-2">{creator.bio}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/creator/${creator.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const CreatorCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-24 w-full" />
    <CardContent className="-mt-10 pt-6 pb-4">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-6 w-32 mt-4" />
        <Skeleton className="h-4 w-24 mt-2" />
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full mt-3" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

export default CreatorCard;