import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Camera,
  Loader2,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { updateProfileSchema, changePasswordSchema } from '../../schemas/authSchema'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
    clearErrors: clearProfileErrors,
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    clearErrors: clearPasswordErrors,
    setError: setPasswordError,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
      })
    }
  }, [user, resetProfile])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    setImagePreview(null)
  }

  const onProfileSubmit = async (data) => {
    setIsLoading(true)
    clearProfileErrors()

    try {
      const updatedUser = await authService.updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
      })
      updateUser(updatedUser)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true)
    clearPasswordErrors()

    try {
      toast.success('Password changed successfully!')
      resetPassword()
    } catch (error) {
      if (error.message === 'Current password is incorrect') {
        setPasswordError('currentPassword', {
          message: 'Current password is incorrect',
        })
      } else {
        toast.error(error.message || 'Failed to change password')
      }
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const getInitials = () => {
    if (!user) return 'U'
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500/10 text-green-400 border-green-500/20',
      inactive: 'bg-red-500/10 text-red-400 border-red-500/20',
    }
    return colors[status] || colors.active
  }

  return (
    <div className="space-y-6 font-poppins">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
        <Badge className={`w-fit capitalize ${getStatusColor(user?.status)}`}>
          {user?.status || 'Active'}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar - User Card */}
        <div className="lg:col-span-1">
          <Card className="border-white/5 bg-white/[0.02]">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-[#2563EB]/30">
                    <AvatarImage src={imagePreview || user?.profile_image} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] p-1.5 text-white shadow-lg transition-transform hover:scale-105"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {imagePreview && (
                    <button
                      onClick={removeImage}
                      className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-lg transition-transform hover:scale-105"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="font-semibold">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="mt-1 capitalize border-white/10">
                    {user?.role}
                  </Badge>
                </div>

                <Separator className="bg-white/5" />

                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span>
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>
                      {user?.updated_at
                        ? new Date(user.updated_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Tabs */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/[0.02] border border-white/5">
              <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563EB] data-[state=active]:to-[#7C3AED] data-[state=active]:text-white">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="password" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563EB] data-[state=active]:to-[#7C3AED] data-[state=active]:text-white">
                <Lock className="mr-2 h-4 w-4" />
                Password
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border-white/5 bg-white/[0.02]">
                <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="firstName"
                            className="pl-9"
                            {...registerProfile('firstName')}
                            disabled={isLoading}
                            aria-invalid={!!profileErrors.firstName}
                          />
                        </div>
                        {profileErrors.firstName && (
                          <p className="text-sm text-destructive">
                            {profileErrors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          {...registerProfile('lastName')}
                          disabled={isLoading}
                          aria-invalid={!!profileErrors.lastName}
                        />
                        {profileErrors.lastName && (
                          <p className="text-sm text-destructive">
                            {profileErrors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          className="pl-9 bg-white/[0.02]"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact support for assistance.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetProfile()}
                      disabled={isLoading}
                      className="border-white/10 hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password">
              <Card className="border-white/5 bg-white/[0.02]">
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="pl-9 pr-10"
                          {...registerPassword('currentPassword')}
                          disabled={isPasswordLoading}
                          aria-invalid={!!passwordErrors.currentPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <Separator className="bg-white/5" />

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          className="pl-9 pr-10"
                          {...registerPassword('newPassword')}
                          disabled={isPasswordLoading}
                          aria-invalid={!!passwordErrors.newPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters with uppercase, lowercase, and a number
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">Confirm new password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirmNewPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="pl-9 pr-10"
                          {...registerPassword('confirmNewPassword')}
                          disabled={isPasswordLoading}
                          aria-invalid={!!passwordErrors.confirmNewPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordErrors.confirmNewPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.confirmNewPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg bg-white/[0.02] border border-white/5 p-4">
                      <p className="text-sm font-medium">Password requirements:</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          At least 8 characters long
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          Contains at least one uppercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          Contains at least one lowercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          Contains at least one number
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetPassword()}
                      disabled={isPasswordLoading}
                      className="border-white/10 hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
                      disabled={isPasswordLoading}
                    >
                      {isPasswordLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changing password...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage