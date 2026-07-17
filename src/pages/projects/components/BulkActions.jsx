import { useState } from 'react';
import { X, Archive, Trash2, AlertTriangle } from 'lucide-react';
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

const BulkActions = ({ selectedCount, onAction, onClear }) => {
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
            case 'archive':
                return {
                    title: 'Archive Projects',
                    description: `Are you sure you want to archive ${selectedCount} selected project(s)? They can be restored later.`,
                    icon: Archive,
                    color: 'text-orange-400',
                    buttonText: 'Archive',
                    buttonClass: 'bg-orange-500 hover:bg-orange-600',
                };
            case 'delete':
                return {
                    title: 'Delete Projects',
                    description: `Are you sure you want to permanently delete ${selectedCount} selected project(s)? This action cannot be undone.`,
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
            <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/20">
                        {selectedCount} selected
                    </Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={onClear}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-1 justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                                Actions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border-border text-foreground">
                            <DropdownMenuItem
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => handleAction('archive')}
                            >
                                <Archive className="mr-2 h-4 w-4 text-orange-400" />
                                Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
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
                <DialogContent className="bg-card border-border text-foreground max-w-md">
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
                            className="border-border text-foreground hover:bg-accent"
                            onClick={() => setShowConfirmDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button className={details?.buttonClass}>
                            {details?.buttonText}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BulkActions;