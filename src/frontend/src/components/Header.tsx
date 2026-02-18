import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-rumpum-teal to-rumpum-blue backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/nepal-investment-logo-transparent.dim_200x200.png"
            alt="Rumpum"
            className="h-10 w-10"
          />
          <div>
            <h1 className="text-xl font-bold text-white">Rumpum</h1>
            <p className="text-xs text-white/80">Smart Investment Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && userProfile && (
            <>
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-white text-rumpum-teal text-sm font-semibold">
                    {getInitials(userProfile.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-white sm:inline-block">{userProfile.name}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-2 text-white hover:bg-white/20 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
