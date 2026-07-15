import { useState } from 'react';
import { X, CheckCircle, UserX, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

export const BulkActions = ({ selectedCount, onAction, onClear }) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const handleAction = (action) => {
        setPendingAction(action);
        setShowConfirmDialog(true);
    };

    const confirmAction = () => {
        onAction(pendingAction);
        setShowConfirmDialog(false);
        setPendingAction(null);
    };

    const getActionDetails = () => {
        switch (pendingAction) {
            case 'activate':
                return {
                    title: 'Activate Users',
                    description: `Are you sure you want to activate ${selectedCount} selected user(s)?`,
                    icon: CheckCircle,
                    color: 'text-green-400',
                    buttonText: 'Activate',
                    buttonClass: 'bg-green-500 hover:bg-green-600',
                };
            case 'deactivate':
                return {
                    title: 'Deactivate Users',
                    description: `Are you sure you want to deactivate ${selectedCount} selected user(s)?`,
                    icon: UserX,
                    color: 'text-orange-400',
                    buttonText: 'Deactivate',
                    buttonClass: 'bg-orange-500 hover:bg-orange-600',
                };
            case 'delete':
                return {
                    title: 'Delete Users',
                    description: `Are you sure you want to permanently delete ${selectedCount} selected user(s)? This action cannot be undone.`,
                    icon: Trash2,
                    color: 'text-red-400',
                    buttonText: 'Delete',
                    buttonClass: 'bg-red-500 hover:bg-red-600',
                };
            default:
                return null;
        }
    };

    const details = getActionDetails();

    return (
        <>
            <div className="flex items-center gap-4 rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/5 p-3">
                <div className="flex items-center gap-2">
                    <Badge className="bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/20">
                        {selectedCount} selected
                    </Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-white"
                        onClick={onClear}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-1 justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity">
                                Actions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0B132B] border-white/10 text-white">
                            <DropdownMenuItem
                                className="cursor-pointer hover:bg-white/5"
                                onClick={() => handleAction('activate')}
                            >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                                Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer hover:bg-white/5"
                                onClick={() => handleAction('deactivate')}
                            >
                                <UserX className="mr-2 h-4 w-4 text-orange-400" />
                                Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-red-400 hover:bg-red-500/10"
                                onClick={() => handleAction('delete')}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Permanently
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="bg-[#0B132B] border-white/10 text-white max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-red-500/10 p-2">
                                <AlertTriangle className="h-6 w-6 text-red-400" />
                            </div>
                            <div>
                                <DialogTitle>{details?.title}</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    {details?.description}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => setShowConfirmDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button className={details?.buttonClass} onClick={confirmAction}>
                            {details?.buttonText}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};