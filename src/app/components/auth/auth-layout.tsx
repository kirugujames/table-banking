import { Shield } from "lucide-react";
import loginBg from "@/assets/login-bg.png";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    companyName?: string;
}

export function AuthLayout({ children, title, subtitle, companyName }: AuthLayoutProps) {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: `url(${loginBg})` }}
                />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Shield className="mr-2 h-6 w-6" />
                    {companyName || "SecureSACCO"}
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2 bg-black/40 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-sm">
                            "This platform has revolutionized how we manage our SACCO operations, providing transparency and efficiency for members"
                        </p>
                        <footer className="text-[10px]"></footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[400px]">
                    <div className="flex flex-col items-center space-y-2 text-center mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-1">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-primary">
                            {companyName || "Sacco System"}
                        </h2>
                    </div>
                    <div className="flex flex-col space-y-1 text-center mb-2">
                        <h1 className="text-lg font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
