import React from 'react';
import { Link } from 'react-router-dom';
import { FootprintsIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FootprintsIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">OnlyFeet</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The premium platform for exclusive foot content creators and enthusiasts.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Creators</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/creators/apply" className="text-muted-foreground hover:text-foreground transition-colors">
                  Become a Creator
                </Link>
              </li>
              <li>
                <Link to="/creators/guidelines" className="text-muted-foreground hover:text-foreground transition-colors">
                  Creator Guidelines
                </Link>
              </li>
              <li>
                <Link to="/creators/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OnlyFeet. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Instagram
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
              TikTok
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;