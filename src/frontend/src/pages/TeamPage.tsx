import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Award } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Team</h1>
        <p className="text-muted-foreground">Build your network and earn together</p>
      </div>

      <Card className="border-rumpum-teal/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-rumpum-teal" />
            <CardTitle>Team Overview</CardTitle>
          </div>
          <CardDescription>Your referral network and team statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Users className="h-8 w-8 mx-auto mb-2 text-rumpum-teal" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <UserPlus className="h-8 w-8 mx-auto mb-2 text-rumpum-blue" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Direct Referrals</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Award className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-2xl font-bold">₹0</p>
              <p className="text-sm text-muted-foreground">Team Earnings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Team features will be available soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Referral system and team management features are under development
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
