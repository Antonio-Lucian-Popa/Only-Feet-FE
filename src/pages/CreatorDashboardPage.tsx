import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getCreatorMedia } from '@/lib/api';
import { Media } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import MediaUploadForm from '@/components/dashboard/MediaUploadForm';
import MediaGallery from '@/components/media/MediaGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileIcon, UsersIcon, DollarSignIcon } from 'lucide-react';

const CreatorDashboardPage: React.FC = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not a creator
  useEffect(() => {
    if (user && user.role !== 'CREATOR') {
      toast({
        variant: 'destructive',
        title: 'Access denied',
        description: 'Only creators can access the dashboard.',
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  const loadMedia = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await getCreatorMedia(user.id);
      setMedia(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load your media.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMedia();
    }
  }, [user]);

  const publicMedia = media.filter(item => item.isPublic);
  const privateMedia = media.filter(item => !item.isPublic);

  // Mock stats for demo purposes
  const subscriberCount = 37;
  const totalEarnings = 723.50;

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your content and keep track of your subscribers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Content
            </CardTitle>
            <FileIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{media.length}</div>
            <p className="text-xs text-muted-foreground">
              {publicMedia.length} public, {privateMedia.length} premium
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscribers
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriberCount}</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              After platform fees
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload New Content</TabsTrigger>
          <TabsTrigger value="manage">Manage Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Photo</CardTitle>
              <CardDescription>
                Add new content to your profile. Premium content is only visible to your subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaUploadForm onSuccess={loadMedia} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Content</CardTitle>
              <CardDescription>
                Manage all your photos. You currently have {media.length} photos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-xl" />
                  ))}
                </div>
              ) : (
                <MediaGallery 
                  media={media} 
                  isSubscribed={true} 
                  emptyMessage="You haven't uploaded any photos yet."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboardPage;