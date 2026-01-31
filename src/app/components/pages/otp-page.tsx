import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/app/components/auth/auth-layout";

interface OtpPageProps {
    onVerify: (otp: string) => void;
    onBack: () => void;
    email?: string;
    isLoading?: boolean;
    companyName?: string;
}

export function OtpPage({ onVerify, onBack, email, isLoading, companyName }: OtpPageProps) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 2}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index}`);
            prevInput?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pastedData.length === 6) {
            setOtp(pastedData);
            const lastInput = document.getElementById('otp-6');
            lastInput?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onVerify(otp.join(""));
    };

    return (
        <AuthLayout
            title="Verify Your Identity"
            subtitle={`We've sent a 6-digit code to ${email || "your email"}`}
            companyName={companyName}
        >
            <div className="grid gap-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label className="text-sm font-medium" htmlFor="otp">
                                Verification Code
                            </Label>
                            <div className="flex gap-2 justify-between">
                                {otp.map((digit, i) => (
                                    <Input
                                        key={i}
                                        id={`otp-${i + 1}`}
                                        type="text"
                                        maxLength={1}
                                        className="h-12 w-12 text-center text-base"
                                        placeholder="•"
                                        required
                                        value={digit}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        onPaste={handlePaste}
                                    />
                                ))}
                            </div>
                        </div>
                        <Button type="submit" size="default" className="h-11 text-sm mt-2" disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Verify Code"}
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
            <p className="px-8 text-center text-[10px] text-muted-foreground mt-4">
                Didn't receive a code?{" "}
                <button className="text-primary hover:underline underline-offset-4">Resend</button>
            </p>
        </AuthLayout>
    );
}
