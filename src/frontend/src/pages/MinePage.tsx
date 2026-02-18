import { useGetPortfolio, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, TrendingUp, Award, User } from 'lucide-react';
import TransactionActions from '../components/TransactionActions';

export default function MinePage() {
  const { data: portfolio, isLoading: portfolioLoading } = useGetPortfolio();
  const { data: userProfile } = useGetCallerUserProfile();

  const formatCurrency = (amount: bigint) => {
    return `₹${Number(amount).toLocaleString('en-NP')}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getVIPTitle = (level: number) => {
    if (level === 0) return 'No Plan';
    return `VIP ${level}`;
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-rumpum-teal to-rumpum-blue text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarFallback className="bg-white text-rumpum-teal text-2xl font-bold">
                {userProfile ? getInitials(userProfile.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{userProfile?.name || 'User'}</h2>
              <p className="text-white/80">
                {portfolio ? getVIPTitle(Number(portfolio.vipLevel)) : 'Loading...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Stats */}
      {portfolioLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-rumpum-teal" />
                <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(portfolio?.balance || BigInt(0))}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-sm font-medium text-muted-foreground">Daily Profit</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-500">
                {formatCurrency(portfolio?.dailyProfit || BigInt(0))}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-rumpum-blue" />
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Profits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(portfolio?.profits || BigInt(0))}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-sm font-medium text-muted-foreground">VIP Level</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getVIPTitle(Number(portfolio?.vipLevel || 0))}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction Actions */}
      <TransactionActions />
    </div>
  );
}
