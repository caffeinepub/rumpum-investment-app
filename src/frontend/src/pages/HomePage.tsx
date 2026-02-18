import { useGetPortfolio, useGetLiveTransactions } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, Radio, Headphones } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import TransactionActions from '../components/TransactionActions';

export default function HomePage() {
  const { data: portfolio, isLoading: portfolioLoading } = useGetPortfolio();
  const { data: liveTransactions, isLoading: liveLoading } = useGetLiveTransactions();

  const formatCurrency = (amount: bigint) => {
    return `₹${Number(amount).toLocaleString('en-NP')}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-NP');
  };

  const anonymizeUser = (principal: string) => {
    return `User ****${principal.slice(-4)}`;
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rumpum-teal to-rumpum-blue p-8 text-white">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Secure Your Future with Smart Investment</h2>
          <p className="text-white/90 mb-4">Join VIP plans and earn daily profits automatically</p>
          <img
            src="/assets/generated/nepal-investment-hero.dim_1200x600.jpg"
            alt="Investment"
            className="w-full h-48 object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Launch Date */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
        <CardContent className="py-4">
          <p className="text-sm text-emerald-400 font-medium">Launched Date: Jan 31, 9:00 AM</p>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Link to="/product">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
            <CardContent className="pt-6 pb-4">
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
                <span className="text-sm font-medium text-slate-700">DEPOSIT</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
          <CardContent className="pt-6 pb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ArrowUpCircle className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-slate-700">WITHDRAW</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
          <CardContent className="pt-6 pb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-orange-500" />
              </div>
              <span className="text-sm font-medium text-slate-700">SUPPORT</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
          <CardContent className="pt-6 pb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <span className="text-sm font-medium text-slate-700">LUCKY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
          <CardContent className="pt-6 pb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <span className="text-sm font-medium text-slate-700">CHECKIN</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow text-center">
          <CardContent className="pt-6 pb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <span className="text-sm font-medium text-slate-700">BANK</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-emerald-500 animate-pulse" />
            <CardTitle>Live Transactions</CardTitle>
          </div>
          <CardDescription>Recent platform activity</CardDescription>
        </CardHeader>
        <CardContent>
          {liveLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : liveTransactions && liveTransactions.length > 0 ? (
            <div className="space-y-3">
              {liveTransactions.slice(0, 10).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {txn.txnType === 'deposit' ? (
                      <ArrowDownCircle className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <ArrowUpCircle className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {anonymizeUser(txn.user.toString())} successfully{' '}
                        {txn.txnType === 'deposit' ? 'Recharge' : 'Withdraw'}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(txn.timestamp)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${txn.txnType === 'deposit' ? 'text-emerald-500' : 'text-blue-500'}`}>
                    {formatCurrency(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          )}
        </CardContent>
      </Card>

      {/* Customer Service */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-900 dark:text-orange-100">Customer Service</CardTitle>
          </div>
          <CardDescription className="text-orange-700 dark:text-orange-200">
            Need help? Contact us for eSewa deposits and support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/esewa-icon-transparent.dim_64x64.png"
                alt="eSewa"
                className="h-10 w-10"
              />
              <div>
                <p className="text-sm font-medium text-muted-foreground">eSewa Deposit Number</p>
                <p className="text-lg font-bold text-foreground">9745573457</p>
              </div>
            </div>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
              Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
