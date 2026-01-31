import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { PasswordInput } from "@/app/components/ui/password-input";
import { Label } from "@/app/components/ui/label";
import { ArrowRight } from "lucide-react";
import { AuthLayout } from "@/app/components/auth/auth-layout";

interface LoginPageProps {
    onLogin: (email: string, pass: string) => void;
    onForgotPassword: () => void;
    isLoading?: boolean;
    companyName?: string;
}

export function LoginPage({ onLogin, onForgotPassword, isLoading, companyName }: LoginPageProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        onLogin(email, password);
    };

    return (
        <AuthLayout
            title="Sign In to Your Account"
            subtitle="Empowering our community, one member at a time"
            companyName={companyName}
        >
            <div className="grid gap-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label className="text-sm font-medium" htmlFor="email">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                required
                                className="h-11 text-sm px-4"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium" htmlFor="password">
                                    Password
                                </Label>
                                <button
                                    type="button"
                                    onClick={onForgotPassword}
                                    className="text-xs text-primary hover:underline underline-offset-4"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                autoCapitalize="none"
                                autoComplete="current-password"
                                required
                                className="h-11 text-sm px-4"
                            />
                        </div>
                        <Button type="submit" size="default" className="h-11 text-sm mt-2" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    Logging in...
                                </span>
                            ) : (
                                <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                            )}
                        </Button>
                    </div>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button variant="outline" type="button" size="default" className="h-11 text-sm" onClick={() => onLogin('', '')}>
                    Sign In with Google
                </Button>
            </div>
            <p className="px-8 text-center text-[10px] text-muted-foreground mt-2">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">Terms</a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy</a>.
            </p>
        </AuthLayout>
    );
}
