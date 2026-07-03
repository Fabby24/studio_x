import { useState } from 'react'
import { X, CheckCircle, UserX, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'

export const BulkActions = ({ selectedCount, onAction, onClear }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const handleAction = (action) => {
    setPendingAction(action)
    setShowConfirmDialog(true)
  }

  const confirmAction = () => {
    onAction(pendingAction)
    setShowConfirmDialog(false)
    setPendingAction(null)
  }

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
        }
      case 'deactivate':
        return {
          title: 'Deactivate Users',
          description: `Are you sure you want to deactivate ${selectedCount} selected user(s)?`,
          icon: UserX,
          color: 'text-orange-400',
          buttonText: 'Deactivate',
          buttonClass: 'bg-orange-500 hover:bg-orange-600',
        }
      case 'delete':
        return {
          title: 'Delete Users',
          description: `Are you sure you want to delete ${selectedCount} selected user(s)? This action cannot be undone.`,
          icon: Trash2,
          color: 'text-red-400',
          buttonText: 'Delete',
          buttonClass: 'bg-red-500 hover:bg-red-600',
        }
      default:
        return null
    }
  }

  const details = getActionDetails()

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
          <Button
            size="sm"
            variant="outline"
            className="border-green-500/20 text-green-400 hover:bg-green-500/10 hover:text-green-300"
            onClick={() => handleAction('activate')}
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Activate
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-orange-500/20 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
            onClick={() => handleAction('deactivate')}
          >
            <UserX className="mr-1 h-3 w-3" />
            Deactivate
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => handleAction('delete')}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
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
            <Button
              className={details?.buttonClass}
              onClick={confirmAction}
            >
              {details?.buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}