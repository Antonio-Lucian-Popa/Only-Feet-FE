import React, { useState } from 'react';
import { Media } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FootprintsIcon, InfoIcon, XIcon, PlayIcon } from 'lucide-react';

interface MediaGalleryProps {
  media: Media[];
  isSubscribed: boolean;
  emptyMessage?: string;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  media, 
  isSubscribed, 
  emptyMessage = "No content available" 
}) => {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  if (media.length === 0) {
    return (
      <div className="text-center py-8">
        <FootprintsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div 
            key={item.id} 
            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group 
              ${!item.isPublic && !isSubscribed ? 'premium-blur' : ''}`}
            onClick={() => {
              if (item.isPublic || isSubscribed) {
                setSelectedMedia(item);
              }
            }}
          >
            {item.type === 'video' ? (
              <div className="relative w-full h-full">
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayIcon className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ) : (
              <img 
                src={item.thumbnailUrl || item.url} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            {(item.isPublic || isSubscribed) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white font-medium line-clamp-1">{item.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  {!item.isPublic && (
                    <span className="bg-premium/80 text-white text-xs px-2 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                  {item.type === 'video' && (
                    <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                      Video
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] flex flex-col p-0 gap-0 bg-background">
          <DialogHeader className="px-4 py-2 flex flex-row items-center justify-between border-b">
            <DialogTitle>{selectedMedia?.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setSelectedMedia(null)}>
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto relative min-h-[50vh]">
            {selectedMedia?.type === 'video' ? (
              <video
                src={selectedMedia.url}
                controls
                className="w-full h-auto max-h-[80vh]"
                autoPlay
              />
            ) : (
              <img 
                src={selectedMedia?.url} 
                alt={selectedMedia?.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
          </div>
          
          {selectedMedia?.description && (
            <div className="p-4 border-t">
              <div className="flex items-start gap-2">
                <InfoIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground text-sm">{selectedMedia.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaGallery;