import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FootprintsIcon } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container relative overflow-hidden bg-gradient-to-b from-background to-background/95 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center justify-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              #1 Foot Content Platform
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              The Platform for Premium Foot Content Creators
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join the exclusive community of foot enthusiasts. Subscribe to your favorite creators or become a creator yourself and earn from your exclusive content.
            </p>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button size="lg" onClick={() => navigate('/discover')}>
                Discover Creators
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
                Join OnlyFeet
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px]">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-primary/20">
                  <FootprintsIcon className="h-20 w-20 text-primary" />
                </div>
              </div>
              <div className="absolute left-[15%] top-[20%] h-16 w-16 rounded-full bg-accent/70 animate-pulse" 
                   style={{ animationDelay: '0.2s', animationDuration: '3s' }}></div>
              <div className="absolute right-[15%] top-[15%] h-20 w-20 rounded-full bg-primary/30 animate-pulse"
                   style={{ animationDelay: '0.5s', animationDuration: '4s' }}></div>
              <div className="absolute bottom-[20%] left-[20%] h-24 w-24 rounded-full bg-primary/40 animate-pulse"
                   style={{ animationDelay: '0.7s', animationDuration: '3.5s' }}></div>
              <div className="absolute bottom-[10%] right-[10%] h-16 w-16 rounded-full bg-accent/60 animate-pulse"
                   style={{ animationDelay: '1s', animationDuration: '4.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;