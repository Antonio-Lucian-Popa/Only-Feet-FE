/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { uploadMedia } from '@/lib/services/media';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, VideoIcon, Loader2Icon, UploadIcon, XIcon } from 'lucide-react';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

const uploadFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

interface MediaUploadFormProps {
  onSuccess?: () => void;
}

const getVideoDuration = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.src = URL.createObjectURL(file);
  });
};

const MediaUploadForm: React.FC<MediaUploadFormProps> = ({ onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: true,
    },
  });

  const validateFiles = async (existingFiles: File[], newFiles: File[]): Promise<string | null> => {
    const totalFiles = existingFiles.length + newFiles.length;
    if (totalFiles > MAX_FILES) return `You can only upload up to ${MAX_FILES} files at once`;

    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE) return 'Each file must be less than 50MB';
      if (!ACCEPTED_TYPES.includes(file.type)) return 'Only JPEG, PNG, WebP images and MP4, WebM videos are supported';

      if (file.type.startsWith('video/')) {
        const duration = await getVideoDuration(file);
        if (duration > 30) return 'Videos must be 30 seconds or less';
      }
    }

    return null;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    const error = await validateFiles(selectedFiles, newFiles);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid files',
        description: error,
      });
      event.target.value = '';
      return;
    }

    const newPreviews = newFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: UploadFormValues) => {
    if (selectedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please select at least one file to upload',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = selectedFiles.length;

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("visibility", data.isPublic.toString()); // ex: "PUBLIC"

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

       await uploadMedia(formData);

      toast({
        title: 'Upload successful',
        description: `Successfully uploaded ${totalFiles} file${totalFiles > 1 ? 's' : ''}`,
      });

      form.reset();
      // Clean up previews
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error uploading your files',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your post" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add details about your content"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public content</FormLabel>
                <FormDescription>
                  Make this content visible to everyone, not just subscribers
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Upload Files</FormLabel>
          <Input
            ref={fileInputRef}
            type="file"
            accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(',')}
            multiple
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <FormDescription>
            Upload up to {MAX_FILES} files (max 50MB each). Supported formats: JPEG, PNG, WebP images and MP4, WebM videos (max 30 seconds)
          </FormDescription>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                {preview.file.type.startsWith('video/') ? (
                  <video
                    src={preview.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <XIcon className="h-4 w-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                  {preview.file.type.startsWith('video/') ? (
                    <div className="flex items-center">
                      <VideoIcon className="h-3 w-3 mr-1" />
                      <span>Video</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      <span>Image</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-sm text-muted-foreground text-center">
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Content ({selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''})
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default MediaUploadForm;