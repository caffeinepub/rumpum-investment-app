import { useGetInvestmentPlans, useJoinPlan, useGetPortfolio } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProductPage() {
  const { data: plans, isLoading: plansLoading } = useGetInvestmentPlans();
  const { data: portfolio } = useGetPortfolio();
  const { mutate: joinPlan, isPending } = useJoinPlan();

  const formatCurrency = (amount: bigint) => {
    return `₹${Number(amount).toLocaleString('en-NP')}`;
  };

  const handleJoinPlan = (planId: number) => {
    joinPlan(BigInt(planId));
  };

  const isUserInPlan = (vipLevel: number) => {
    return portfolio?.vipLevel !== undefined && Number(portfolio.vipLevel) === vipLevel;
  };

  if (plansLoading) {
    return (
      <div className="container py-6 space-y-4">
        <Skeleton className="h-12 w-64" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-rumpum-teal to-rumpum-blue bg-clip-text text-transparent">
          Investment Market
        </h1>
        <p className="text-muted-foreground">Choose your VIP plan and start earning daily profits</p>
      </div>

      <div className="space-y-4">
        {plans?.map((plan, index) => {
          const isJoined = isUserInPlan(Number(plan.vipLevel));
          return (
            <Card
              key={plan.vipLevel.toString()}
              className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow"
              style={{
                borderColor: isJoined ? 'rgb(16, 185, 129)' : undefined,
              }}
            >
              {isJoined && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-emerald-500 text-white">Active</Badge>
                </div>
              )}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rumpum-teal to-rumpum-blue" />
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-rumpum-teal to-rumpum-blue flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">V{plan.vipLevel.toString()}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{plan.title}</CardTitle>
                      <CardDescription className="mt-1">
                        <span className="text-lg font-semibold text-foreground">
                          Price: {formatCurrency(plan.price)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
                  <span className="text-sm font-medium text-muted-foreground">Daily Income</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(plan.dailyIncome)}
                  </span>
                </div>

                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleJoinPlan(Number(plan.vipLevel) - 1)}
                  disabled={isPending || isJoined}
                  className="w-full bg-gradient-to-r from-rumpum-teal to-rumpum-blue hover:opacity-90"
                  size="lg"
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isJoined ? 'Already Joined' : 'Join'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
