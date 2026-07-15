import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useUpdateUser } from '../../../hooks/useUsers';
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

const editUserSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters').max(50).optional(),
    last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50).optional(),
    role: z.enum(['org_admin', 'team_member']),
    status: z.enum(['active', 'inactive']),
});

export const EditUserModal = ({ open, onOpenChange, user, onSuccess }) => {
    const updateUser = useUpdateUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            role: 'team_member',
            status: 'active',
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                role: user.role || 'team_member',
                status: user.status || 'active',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            await updateUser.mutateAsync({ id: user.id, data });
            onSuccess?.();
        } catch (error) {
            // Error handled by service
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0B132B] border-white/10 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Update user information and permissions.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First name</Label>
                            <Input
                                id="first_name"
                                className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                {...register('first_name')}
                                disabled={updateUser.isPending}
                            />
                            {errors.first_name && (
                                <p className="text-sm text-red-400">{errors.first_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last name</Label>
                            <Input
                                id="last_name"
                                className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                {...register('last_name')}
                                disabled={updateUser.isPending}
                            />
                            {errors.last_name && (
                                <p className="text-sm text-red-400">{errors.last_name.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            className="bg-white/[0.02] border-white/10 text-white opacity-60"
                            disabled
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                onValueChange={(value) => setValue('role', value)}
                                defaultValue={user?.role || 'team_member'}
                                disabled={updateUser.isPending}
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

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                onValueChange={(value) => setValue('status', value)}
                                defaultValue={user?.status || 'active'}
                                disabled={updateUser.isPending}
                            >
                                <SelectTrigger className="bg-white/[0.02] border-white/10 text-white">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0B132B] border-white/10">
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-400">{errors.status.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => onOpenChange(false)}
                            disabled={updateUser.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
                            disabled={updateUser.isPending}
                        >
                            {updateUser.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update User'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};