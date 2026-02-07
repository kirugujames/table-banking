import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/app/lib/auth-context';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';

const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 25 * 60 * 1000; // 25 minutes (show dialog after 25 mins)

export function InactivityLogout({ children }: { children: React.ReactNode }) {
    const { logout, isAuthenticated } = useAuth();
    const [showWarning, setShowWarning] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const lastActivityRef = useRef(Date.now());

    const resetTimer = useCallback(() => {
        lastActivityRef.current = Date.now();
        if (showWarning) {
            setShowWarning(false);
        }
    }, [showWarning]);

    useEffect(() => {
        if (!isAuthenticated) {
            setShowWarning(false);
            return;
        }

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove', 'click'];
        const handleActivity = () => resetTimer();

        events.forEach(event => window.addEventListener(event, handleActivity));

        const checkInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastActivityRef.current;

            if (elapsed >= INACTIVITY_TIME) {
                logout();
                setShowWarning(false);
            } else if (elapsed >= WARNING_TIME) {
                setShowWarning(true);
                setRemainingTime(Math.ceil((INACTIVITY_TIME - elapsed) / 1000));
            } else {
                setShowWarning(false);
            }
        }, 1000);

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            clearInterval(checkInterval);
        };
    }, [isAuthenticated, logout, resetTimer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            {children}
            <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your session will expire in {formatTime(remainingTime)} due to inactivity.
                            Please click the button below to stay logged in.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={resetTimer}>Stay Logged In</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
