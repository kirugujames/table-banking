import { useState, useEffect } from 'react';
import { Toaster as HotToaster } from 'react-hot-toast';
import { DashboardLayout } from '@/app/components/dashboard-layout';
import { DashboardPage } from '@/app/components/pages/dashboard-page';
import { MembersPage } from '@/app/components/pages/members-page';
import { LoansPage } from '@/app/components/pages/loans-page';
import { SavingsPage } from '@/app/components/pages/savings-page';
import { TransactionsPage } from '@/app/components/pages/transactions-page';
import { ExpensesPage } from '@/app/components/pages/expenses-page';
import { ReportsPage } from '@/app/components/pages/reports-page';
import { SettingsPage } from '@/app/components/pages/settings-page';
import { LoginPage } from '@/app/components/pages/login-page';
import { OtpPage } from '@/app/components/pages/otp-page';
import { ForgotPasswordPage } from '@/app/components/pages/forgot-password-page';
import { ResetPasswordPage } from '@/app/components/pages/reset-password-page';
import { AuthProvider, useAuth } from '@/app/lib/auth-context';
import { Role } from '@/app/lib/roles';
import { Toaster } from '@/app/components/ui/sonner';
import { toast } from 'sonner';
import { authService } from '@/app/lib/auth-service';

function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout, verifyOtp, checkUserExists, resetPassword } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authStage, setAuthStage] = useState('login'); // login, otp, forgot-password, reset-password-otp, reset-password
  const [userEmail, setUserEmail] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Handle initial page state
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setCurrentPage('login');
    } else if (!isLoading && isAuthenticated && currentPage === 'login') {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated, isLoading, currentPage]);

  const handleLogin = async (email: string, pass: string) => {
    setIsAuthLoading(true);
    try {
      const result = await login(email, pass);
      if (result.success_key === 1) {
        toast.success(result.message || 'OTP sent to your email');
        setUserEmail(email);
        setCompanyName(result.company || '');
        setAuthStage('otp');
      } else {
        toast.error(result.message || 'Authentication Failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('An unexpected error occurred during login');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setIsAuthLoading(true);
    try {
      if (authStage === 'reset-password-otp') {
        await authService.verifyOtp(userEmail, otp);
        toast.success('OTP verified. Please reset your password.');
        setUserOtp(otp);
        setAuthStage('reset-password');
      } else {
        await verifyOtp(userEmail, otp);
        toast.success('Login successful!');
        setCurrentPage('dashboard');
        setAuthStage('login');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setAuthStage('forgot-password');
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    setIsAuthLoading(true);
    try {
      const result = await checkUserExists(email);
      if (result.exists) {
        toast.success(result.message || 'OTP sent to your email');
        setUserEmail(email);
        setAuthStage('reset-password-otp');
      } else {
        toast.error(result.message || 'User does not exist');
      }
    } catch (error) {
      console.error('Check user failed:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    setIsAuthLoading(true);
    try {
      const result = await resetPassword(userEmail, userOtp, newPassword);
      if (result.status === 'success') {
        toast.success(result.message || 'Password reset successful. Please login.');
        setAuthStage('login');
      } else {
        toast.error(result.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setAuthStage('login');
  };

  const renderAuthPage = () => {
    switch (authStage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} isLoading={isAuthLoading} companyName={companyName} />;
      case 'otp':
        return <OtpPage onVerify={handleOtpVerify} onBack={handleBackToLogin} email="demo@example.com" isLoading={isAuthLoading} companyName={companyName} />;
      case 'forgot-password':
        return <ForgotPasswordPage onSumbit={handleForgotPasswordSubmit} onBack={handleBackToLogin} isLoading={isAuthLoading} />;
      case 'reset-password-otp':
        return <OtpPage onVerify={handleOtpVerify} onBack={handleBackToLogin} email={userEmail} isLoading={isAuthLoading} />;
      case 'reset-password':
        return <ResetPasswordPage onReset={handleResetPassword} onBack={handleBackToLogin} isLoading={isAuthLoading} />;
      default:
        return <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} isLoading={isAuthLoading} />;
    }
  };

  const renderMainPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'members':
        return <MembersPage />;
      case 'loans':
        return <LoansPage />;
      case 'savings':
        return <SavingsPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'expenses':
        return <ExpensesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-xl font-medium text-primary animate-pulse">Loading SACCO Management...</div>
      </div>
    );
  }

  if (!isAuthenticated || currentPage === 'login') {
    return renderAuthPage();
  }

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      user={user}
      onLogout={logout}
    >
      {renderMainPage()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-center" expand={true} richColors />
      <HotToaster position="top-right" />
    </AuthProvider>
  );
}
