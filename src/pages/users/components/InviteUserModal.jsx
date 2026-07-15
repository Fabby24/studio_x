import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import { useInviteUser } from '../../../hooks/useUsers';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';

const inviteSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    role: z.enum(['org_admin', 'team_member']).default('team_member'),
});

export const InviteUserModal = ({ open, onOpenChange, onSuccess }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const inviteUser = useInviteUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = useForm({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            email: '',
            role: 'team_member',
        },
    });

    const onSubmit = async (data) => {
        try {
            await inviteUser.mutateAsync(data);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                reset();
                onSuccess?.();
            }, 2000);
        } catch (error) {
            // Error handled by service
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        reset();
        setShowSuccess(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0B132B] border-white/10 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Send an invitation to join your organization.
                    </DialogDescription>
                </DialogHeader>

                {showSuccess ? (
                    <div className="py-8 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                            <Send className="h-6 w-6 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Invitation Sent!</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            The user will receive an email with instructions to join.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="colleague@company.com"
                                className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                {...register('email')}
                                disabled={inviteUser.isPending}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                onValueChange={(value) => setValue('role', value)}
                                defaultValue="team_member"
                                disabled={inviteUser.isPending}
                            >
                                <SelectTrigger className="bg-white/[0.02] border-white/10 text-white">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0B132B] border-white/10">
                                    <SelectItem value="org_admin">Admin</SelectItem>
                                    <SelectItem value="team_member">Team Member</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="text-sm text-red-400">{errors.role.message}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-white/10 hover:bg-white/5"
                                onClick={handleClose}
                                disabled={inviteUser.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
                                disabled={inviteUser.isPending}
                            >
                                {inviteUser.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Invitation
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};