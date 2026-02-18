import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, Wallet, Lock } from 'lucide-react';

export default function LoginPrompt() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-8 flex justify-center">
            <img
              src="/assets/generated/nepal-investment-hero.dim_1200x600.jpg"
              alt="Rumpum Investment"
              className="h-64 w-full max-w-4xl rounded-2xl object-cover shadow-2xl"
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Secure Your Future with Smart Investment
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join Rumpum, Nepal's trusted investment platform. Deposit funds via eSewa, choose VIP plans, and earn daily profits automatically.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="gap-2 px-8 text-lg bg-gradient-to-r from-rumpum-teal to-rumpum-blue hover:opacity-90"
          >
            <Shield className="h-5 w-5" />
            {isLoggingIn ? 'Connecting...' : 'Login with Internet Identity'}
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-rumpum-teal/20">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-rumpum-teal/10">
                <Wallet className="h-6 w-6 text-rumpum-teal" />
              </div>
              <CardTitle>eSewa Integration</CardTitle>
              <CardDescription>
                Seamlessly deposit and withdraw funds using your eSewa wallet
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-rumpum-blue/20">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-rumpum-blue/10">
                <TrendingUp className="h-6 w-6 text-rumpum-blue" />
              </div>
              <CardTitle>VIP Investment Plans</CardTitle>
              <CardDescription>
                Choose from 5 VIP tiers and earn daily profits automatically
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is protected with Internet Identity authentication on the blockchain
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
