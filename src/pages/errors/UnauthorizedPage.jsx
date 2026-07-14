import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/authStore';

const UnauthorizedPage = () => {
    const { user } = useAuthStore();
    
    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'super_admin') return '/dashboard/super-admin';
        if (user.role === 'org_admin') return '/dashboard/admin';
        return '/dashboard/team';
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0B132B] p-4 font-poppins">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >
                <div className="flex justify-center">
                    <div className="rounded-full bg-red-500/10 p-6">
                        <Shield className="h-16 w-16 text-red-400" />
                    </div>
                </div>
                
                <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">Access Denied</h1>
                <p className="mt-2 text-muted-foreground">
                    You don't have permission to access this page. This area is restricted to authorized users only.
                </p>
                
                {user && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        Your current role: <span className="font-medium capitalize text-white">{user.role}</span>
                    </p>
                )}
                
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link to={getDashboardLink()}>
                        <Button className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity">
                            <Home className="mr-2 h-4 w-4" />
                            Go to dashboard
                        </Button>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                        <ArrowLeft className="mr-2 inline h-4 w-4" />
                        Go back
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default UnauthorizedPage;