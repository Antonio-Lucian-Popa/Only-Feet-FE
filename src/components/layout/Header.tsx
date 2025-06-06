import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  FootprintsIcon, 
  UserIcon, 
  LogOutIcon, 
  ImageIcon, 
  HomeIcon, 
  SearchIcon, 
  MenuIcon,
  SettingsIcon 
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const NavItems = () => (
    <>
      <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
        <HomeIcon size={18} />
        <span className="hidden md:inline">Home</span>
      </Link>
      <Link to="/discover" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
        <SearchIcon size={18} />
        <span className="hidden md:inline">Discover</span>
      </Link>
      {isAuthenticated && user?.role === 'CREATOR' && (
        <Link to="/dashboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <ImageIcon size={18} />
          <span className="hidden md:inline">My Content</span>
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <FootprintsIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">OnlyFeet</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6 ml-6">
            <NavItems />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profilePicture} alt={user?.username} />
                      <AvatarFallback>{getInitials(user?.username || 'User')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'USER' && (
                    <DropdownMenuItem asChild>
                      <Link to="/subscriptions">
                        <FootprintsIcon className="mr-2 h-4 w-4" />
                        <span>My Subscriptions</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'CREATOR' && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        <span>Creator Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex sm:items-center sm:gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Sign Up</Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 py-6">
                <div className="flex flex-col space-y-3">
                  <NavItems />
                </div>
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={() => navigate('/login')}>
                      Login
                    </Button>
                    <Button onClick={() => navigate('/register')}>Sign Up</Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;