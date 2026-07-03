import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react'
import { createUserSchema } from '../../../schemas/userSchema'
import { useCreateUser } from '../../../hooks/useUsers'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'

const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export const CreateUserModal = ({ open, onOpenChange, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false)
  const createUser = useCreateUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors,
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'team_member',
      status: 'active',
    },
  })

  const password = watch('password')

  const handleGeneratePassword = () => {
    const newPassword = generatePassword()
    setValue('password', newPassword)
    clearErrors('password')
  }

  const onSubmit = async (data) => {
    try {
      await createUser.mutateAsync(data)
      reset()
      onSuccess?.()
    } catch (error) {
      // Error handled by service
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0B132B] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new team member to your organization.
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
                disabled={createUser.isPending}
                aria-invalid={!!errors.first_name}
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
                disabled={createUser.isPending}
                aria-invalid={!!errors.last_name}
              />
              {errors.last_name && (
                <p className="text-sm text-red-400">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
              {...register('email')}
              disabled={createUser.isPending}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs text-[#2563EB] hover:text-[#2563EB]/80"
                onClick={handleGeneratePassword}
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Generate
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground pr-10"
                {...register('password')}
                disabled={createUser.isPending}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
            {password && !errors.password && (
              <p className="text-xs text-green-400">✓ Strong password</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) => setValue('role', value)}
                defaultValue="team_member"
                disabled={createUser.isPending}
              >
                <SelectTrigger className="bg-white/[0.02] border-white/10 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B132B] border-white/10">
                  <SelectItem value="admin">Admin</SelectItem>
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
                defaultValue="active"
                disabled={createUser.isPending}
              >
                <SelectTrigger className="bg-white/[0.02] border-white/10 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B132B] border-white/10">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-white/10 hover:bg-white/5"
              onClick={() => onOpenChange(false)}
              disabled={createUser.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
              disabled={createUser.isPending}
            >
              {createUser.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}