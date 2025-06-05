import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FootprintsIcon, CameraIcon, CreditCardIcon, LockIcon } from 'lucide-react';

const features = [
  {
    title: "Find Your Favorites",
    description: "Discover creators with unique foot content tailored to your preferences.",
    icon: FootprintsIcon,
  },
  {
    title: "Exclusive Content",
    description: "Creators regularly upload new, high-quality photos that you won't find anywhere else.",
    icon: CameraIcon,
  },
  {
    title: "Easy Subscriptions",
    description: "Subscribe monthly to your favorite creators with secure payment processing.",
    icon: CreditCardIcon,
  },
  {
    title: "Private Access",
    description: "Get full access to all premium content from creators you subscribe to.",
    icon: LockIcon,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">How OnlyFeet Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join our exclusive platform in just a few simple steps and start enjoying premium foot content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 shadow-none transition-all duration-200 hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;