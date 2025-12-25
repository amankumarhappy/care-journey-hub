import { useState } from 'react';
import { Trophy, Target, Zap, Gift, ChevronRight, Check, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DailyTask {
  id: string;
  title: string;
  description: string;
  coins: number;
  completed: boolean;
  type: 'medicine' | 'activity' | 'diet' | 'checkup';
}

const initialTasks: DailyTask[] = [
  { id: '1', title: 'Morning Medicine', description: 'Take Paracetamol 500mg after breakfast', coins: 10, completed: true, type: 'medicine' },
  { id: '2', title: 'Walk 20 Minutes', description: 'Take a 20-minute morning walk', coins: 15, completed: false, type: 'activity' },
  { id: '3', title: 'Drink 8 Glasses', description: 'Stay hydrated throughout the day', coins: 10, completed: false, type: 'diet' },
  { id: '4', title: 'Evening Medicine', description: 'Take Cetirizine 10mg after dinner', coins: 10, completed: false, type: 'medicine' },
  { id: '5', title: 'No Sweets Today', description: 'Avoid sugary foods and desserts', coins: 15, completed: false, type: 'diet' },
];

const rewards = [
  { id: '1', title: '10% Off Consultation', coins: 100, unlocked: true },
  { id: '2', title: 'Free Follow-up', coins: 200, unlocked: false },
  { id: '3', title: 'Priority Booking', coins: 150, unlocked: false },
  { id: '4', title: 'Health Report', coins: 250, unlocked: false },
];

export default function CareJourney() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalCoins = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.coins, 0);
  const progress = (completedTasks / tasks.length) * 100;

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && !t.completed) {
        // Add coins to user
        if (user) {
          updateUser({ coins: (user.coins || 0) + t.coins });
        }
        toast({
          title: `+${t.coins} Coins! 🎉`,
          description: `You completed: ${t.title}`,
        });
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  const handleClaimReward = (rewardId: string, coins: number) => {
    if (user && user.coins >= coins) {
      updateUser({ coins: user.coins - coins });
      toast({
        title: 'Reward Claimed! 🎁',
        description: 'Check your email for the reward details.',
      });
    } else {
      toast({
        title: 'Not enough coins',
        description: 'Complete more tasks to earn coins.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Care Journey 🎮</h1>
        <p className="text-muted-foreground">Complete daily health tasks to earn coins and rewards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user?.coins || 0} 🪙</p>
                <p className="text-sm text-muted-foreground">Total Coins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedTasks}/{tasks.length}</p>
                <p className="text-sm text-muted-foreground">Tasks Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">7 🔥</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Progress */}
      <Card className="border-border/50 mb-8">
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
          <CardDescription>Complete all tasks to earn bonus coins!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completedTasks} of {tasks.length} completed</span>
              <span className="text-primary font-medium">+{totalCoins} coins earned</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Tasks */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Daily Tasks</CardTitle>
              <CardDescription>Based on your doctor's care instructions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all ${
                    task.completed 
                      ? 'bg-success/5 border-success/30' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-success border-success text-success-foreground' 
                          : 'border-muted-foreground hover:border-primary'
                      }`}
                      disabled={task.completed}
                    >
                      {task.completed && <Check className="h-4 w-4" />}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 border-primary/30">
                      +{task.coins} 🪙
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Rewards */}
        <div>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Rewards
              </CardTitle>
              <CardDescription>Redeem your coins for rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rewards.map(reward => (
                <div
                  key={reward.id}
                  className={`p-4 rounded-lg border ${
                    reward.unlocked ? 'border-primary/30 bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{reward.title}</p>
                    {!reward.unlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{reward.coins} 🪙</span>
                    <Button
                      size="sm"
                      variant={reward.unlocked ? 'default' : 'outline'}
                      className={reward.unlocked ? 'gradient-primary border-0' : ''}
                      disabled={!reward.unlocked || (user?.coins || 0) < reward.coins}
                      onClick={() => handleClaimReward(reward.id, reward.coins)}
                    >
                      {reward.unlocked ? 'Claim' : 'Locked'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
