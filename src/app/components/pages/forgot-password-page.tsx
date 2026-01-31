import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/app/components/auth/auth-layout";

interface ForgotPasswordPageProps {
    onSumbit: (email: string) => void;
    onBack: () => void;
    isLoading?: boolean;
}

export function ForgotPasswordPage({ onSumbit, onBack, isLoading }: ForgotPasswordPageProps) {
    return (
        <AuthLayout
            title="Reset Your Password"
            subtitle="Enter your email and we'll send you a code to reset your password"
        >
            <div className="grid gap-6">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                    onSumbit(email);
                }}>
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
                                required
                                className="h-11 text-sm px-4"
                            />
                        </div>
                        <Button type="submit" size="default" className="h-11 text-sm mt-2" disabled={isLoading}>
                            {isLoading ? "Checking..." : "Check Email"} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </form>
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center justify-center text-[10px] text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="mr-1 h-3 w-3" /> Back to Sign In
                </button>
            </div>
        </AuthLayout>
    );
}
