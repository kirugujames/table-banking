import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { PasswordInput } from "@/app/components/ui/password-input";
import { Label } from "@/app/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/app/components/auth/auth-layout";

interface ResetPasswordPageProps {
    onReset: (password: string) => void;
    onBack: () => void;
    isLoading?: boolean;
}

export function ResetPasswordPage({ onReset, onBack, isLoading }: ResetPasswordPageProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isStrongPassword = (pass: string) => {
        return pass.length >= 8 &&
            /[A-Z]/.test(pass) &&
            /[a-z]/.test(pass) &&
            /[0-9]/.test(pass);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!isStrongPassword(password)) {
            toast.error("Password is too weak. It should be at least 8 characters long and include uppercase, lowercase, and numbers.");
            return;
        }

        onReset(password);
    };

    return (
        <AuthLayout
            title="Create New Password"
            subtitle="Your new password must be different from previous used passwords"
        >
            <div className="grid gap-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label className="text-sm font-medium" htmlFor="password">
                                New Password
                            </Label>
                            <PasswordInput
                                id="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 text-sm px-4"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-sm font-medium" htmlFor="confirm-password">
                                Confirm Password
                            </Label>
                            <PasswordInput
                                id="confirm-password"
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-11 text-sm px-4"
                            />
                        </div>
                        <Button type="submit" size="default" className="h-11 text-sm mt-2" disabled={isLoading}>
                            {isLoading ? "Resetting..." : "Reset Password"} <CheckCircle2 className="ml-2 h-4 w-4" />
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
