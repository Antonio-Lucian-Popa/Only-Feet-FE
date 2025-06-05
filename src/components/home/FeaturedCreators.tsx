import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/lib/types';
import { getCreators } from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const FeaturedCreators: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        const response = await getCreators();
        // Just show top 4 creators for the featured section
        setCreators(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching creators:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load featured creators.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="container py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Creators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="creator-card">
              <CardContent className="pt-6 pb-4 space-y-4">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-6 w-32 mt-4" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Creators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {creators.map((creator) => (
          <Card key={creator.id} className="creator-card">
            <CardContent className="pt-6 pb-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
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
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/creator/${creator.id}`}>View Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button variant="outline" asChild>
          <Link to="/discover">View All Creators</Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedCreators;