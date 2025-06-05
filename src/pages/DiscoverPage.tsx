import React, { useState, useEffect } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { getCreators } from '@/lib/api';
import { Creator } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import CreatorCard, { CreatorCardSkeleton } from '@/components/creators/CreatorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon, SlidersIcon } from 'lucide-react';

const DiscoverPage: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const { isSubscribedTo } = useSubscriptions();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        const response = await getCreators();
        setCreators(response.data);
        setFilteredCreators(response.data);
      } catch (error) {
        console.error('Error fetching creators:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load creators.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, [toast]);

  useEffect(() => {
    // Filter creators based on search query
    let results = creators;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = creators.filter(
        creator => creator.username.toLowerCase().includes(query) || 
                 (creator.bio && creator.bio.toLowerCase().includes(query))
      );
    }
    
    // Sort creators
    results = [...results].sort((a, b) => {
      switch (sortOption) {
        case 'popular':
          return b.subscribersCount - a.subscribersCount;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'price-low':
          return a.subscriptionPrice - b.subscriptionPrice;
        case 'price-high':
          return b.subscriptionPrice - a.subscriptionPrice;
        case 'content':
          return b.mediaCount - a.mediaCount;
        default:
          return 0;
      }
    });
    
    setFilteredCreators(results);
  }, [creators, searchQuery, sortOption]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Discover Creators</h1>
        <p className="text-muted-foreground">
          Find and follow your favorite foot content creators
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        
        <div className="flex items-center gap-2">
          <SlidersIcon className="h-4 w-4 text-muted-foreground" />
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="content">Most Content</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <CreatorCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreators.map((creator) => (
            <CreatorCard 
              key={creator.id} 
              creator={creator} 
              isSubscribed={isSubscribedTo(creator.id)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No creators found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `No results for "${searchQuery}". Try a different search term.` 
              : "There are no creators available at the moment."}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;