import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  PiggyBank,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Zap,
  Globe,
  CheckCircle,
} from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  companyName?: string;
}

export function WelcomeScreen({ onGetStarted, companyName }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <PiggyBank className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold">{companyName || "Unity SACCO"}</h1>
              <p className="text-muted-foreground">Management System</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold">
            Welcome to Your Complete SACCO Management Solution
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your savings and credit cooperative operations with our comprehensive,
            professional-grade management platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Member Management</h3>
              <p className="text-sm text-muted-foreground">
                Complete member lifecycle from registration to reporting
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-secondary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Loan Processing</h3>
              <p className="text-sm text-muted-foreground">
                Automated loan workflows from application to repayment
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Analytics & Reports</h3>
              <p className="text-sm text-muted-foreground">
                Real-time insights and comprehensive financial reporting
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-500/50 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Bank-grade security with role-based access control
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Benefits */}
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-6 text-center">Why {companyName || "Unity SACCO"}?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Easy to Use</h4>
                  <p className="text-sm text-muted-foreground">
                    Intuitive interface designed for users of all technical levels
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Zap className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Lightning Fast</h4>
                  <p className="text-sm text-muted-foreground">
                    Built with modern technology for optimal performance
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Globe className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Fully Responsive</h4>
                  <p className="text-sm text-muted-foreground">
                    Access from any device - desktop, tablet, or mobile
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Button size="lg" className="text-lg px-8 py-6" onClick={onGetStarted}>
            Get Started
            <PiggyBank className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Professional SACCO management at your fingertips
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>{companyName || "Unity SACCO"} Management System v1.0.0</p>
          <p className="mt-2">Built with ❤️ for Financial Inclusion</p>
        </div>
      </div>
    </div>
  );
}
