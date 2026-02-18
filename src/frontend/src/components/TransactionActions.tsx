import { useState } from 'react';
import { useDeposit, useWithdraw } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TransactionActions() {
  const [depositAmount, setDepositAmount] = useState('');
  const [depositReference, setDepositReference] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawReference, setWithdrawReference] = useState('');

  const { mutate: deposit, isPending: isDepositing } = useDeposit();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw();

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (amount > 0 && depositReference.trim()) {
      deposit(
        { amount: BigInt(Math.floor(amount)), reference: depositReference.trim() },
        {
          onSuccess: () => {
            setDepositAmount('');
            setDepositReference('');
          },
        }
      );
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && withdrawReference.trim()) {
      withdraw(
        { amount: BigInt(Math.floor(amount)), reference: withdrawReference.trim() },
        {
          onSuccess: () => {
            setWithdrawAmount('');
            setWithdrawReference('');
          },
        }
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Funds</CardTitle>
        <CardDescription>Deposit or withdraw funds using your eSewa wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit" className="gap-2">
              <ArrowDownCircle className="h-4 w-4" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Withdraw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-4">
            <Alert className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200">
              <img
                src="/assets/generated/esewa-icon-transparent.dim_64x64.png"
                alt="eSewa"
                className="h-4 w-4"
              />
              <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                Deposits are processed through eSewa. Contact: 9745573457
              </AlertDescription>
            </Alert>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount (NPR)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit-reference">eSewa Transaction ID</Label>
                <Input
                  id="deposit-reference"
                  placeholder="Enter eSewa transaction ID"
                  value={depositReference}
                  onChange={(e) => setDepositReference(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2 bg-gradient-to-r from-rumpum-teal to-rumpum-blue hover:opacity-90" 
                disabled={isDepositing}
              >
                {isDepositing && <Loader2 className="h-4 w-4 animate-spin" />}
                {isDepositing ? 'Processing...' : 'Deposit Funds'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4">
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200">
              <img
                src="/assets/generated/esewa-icon-transparent.dim_64x64.png"
                alt="eSewa"
                className="h-4 w-4"
              />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Withdrawals are sent to your eSewa wallet. Ensure sufficient balance.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (NPR)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-reference">eSewa Account Reference</Label>
                <Input
                  id="withdraw-reference"
                  placeholder="Enter your eSewa account reference"
                  value={withdrawReference}
                  onChange={(e) => setWithdrawReference(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2 bg-gradient-to-r from-rumpum-teal to-rumpum-blue hover:opacity-90" 
                disabled={isWithdrawing}
              >
                {isWithdrawing && <Loader2 className="h-4 w-4 animate-spin" />}
                {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
