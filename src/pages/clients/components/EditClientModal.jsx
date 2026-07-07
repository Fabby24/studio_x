import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Upload, X } from 'lucide-react'
import { updateClientSchema, INDUSTRIES, PRIORITIES, CONTACT_METHODS, CLIENT_TAGS } from '../../../schemas/clientSchema'
import { useUpdateClient } from '../../../hooks/useClients'
import { useUsers } from '../../../hooks/useUsers'
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
import { Textarea } from '../../../components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'

export const EditClientModal = ({ open, onOpenChange, client, onSuccess }) => {
    const [logoPreview, setLogoPreview] = useState(null)
    const [logoFile, setLogoFile] = useState(null)
    const [selectedTags, setSelectedTags] = useState([])
    const [tagInput, setTagInput] = useState('')
    const updateClient = useUpdateClient()
    const { data: users } = useUsers({ limit: 100 })

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
    } = useForm({
        resolver: zodResolver(updateClientSchema),
        defaultValues: {
            name: '',
            company: '',
            email: '',
            phone: '',
            website: '',
            industry: '',
            status: 'active',
            priority: 'medium',
            preferred_contact: 'email',
            timezone: 'UTC',
            notes: '',
            billing_contact: '',
            payment_terms: '',
            currency: 'USD',
            tax_number: '',
            assigned_to: '',
        },
    })

    useEffect(() => {
        if (client) {
            reset({
                name: client.name || '',
                company: client.company || '',
                email: client.email || '',
                phone: client.phone || '',
                website: client.website || '',
                industry: client.industry || '',
                status: client.status || 'active',
                priority: client.priority || 'medium',
                preferred_contact: client.preferred_contact || 'email',
                timezone: client.timezone || 'UTC',
                notes: client.notes || '',
                billing_contact: client.billing_contact || '',
                payment_terms: client.payment_terms || '',
                currency: client.currency || 'USD',
                tax_number: client.tax_number || '',
                assigned_to: client.assigned_to ? String(client.assigned_to) : '',
            })
            setSelectedTags(client.tags || [])
            if (client.logo) {
                setLogoPreview(client.logo)
            }
        }
    }, [client, reset])

    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) return
            if (!file.type.startsWith('image/')) return
            setLogoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeLogo = () => {
        setLogoFile(null)
        setLogoPreview(null)
    }

    const addTag = () => {
        if (tagInput && !selectedTags.includes(tagInput)) {
            setSelectedTags([...selectedTags, tagInput])
            setTagInput('')
        }
    }

    const removeTag = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
    }

    const onSubmit = async (data) => {
        try {
            const formData = {
                ...data,
                tags: selectedTags,
                assigned_to: data.assigned_to ? parseInt(data.assigned_to) : null,
            }

            await updateClient.mutateAsync({ id: client.id, data: formData })
            reset()
            onSuccess?.()
        } catch (error) {
            // Error handled by service
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0B132B] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Client</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Update client information and preferences.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <Label>Client Logo</Label>
                        <div className="flex items-center gap-4">
                            {logoPreview ? (
                                <div className="relative">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="h-16 w-16 rounded-lg object-cover border border-white/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeLogo}
                                        className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02]">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                            <div className="flex-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Max 5MB. Recommended: Square image (200x200)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Client Name *</Label>
                            <Input
                                id="name"
                                className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                {...register('name')}
                                disabled={updateClient.isPending}
                                aria-invalid={!!errors.name}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-400">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                {...register('company')}
                                disabled={updateClient.isPending}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground opacity-60"
                                {...register('email')}
                                disabled
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                {...register('phone')}
                                disabled={updateClient.isPending}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                {...register('website')}
                                disabled={updateClient.isPending}
                            />
                            {errors.website && (
                                <p className="text-sm text-red-400">{errors.website.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Select
                                onValueChange={(value) => setValue('industry', value)}
                                defaultValue={client?.industry || ''}
                                disabled={updateClient.isPending}
                            >
                                <SelectTrigger className="bg-white/[0.02] border-white/10 text-white">
                                    <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0B132B] border-white/10">
                                    <SelectItem value="">None</SelectItem>
                                    {INDUSTRIES.map((industry) => (
                                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add tag (e.g., VIP, Retainer)"
                                className="flex-1 bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={updateClient.isPending}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="border-white/10 hover:bg-white/5"
                                onClick={addTag}
                                disabled={updateClient.isPending}
                            >
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedTags.map((tag) => (
                                <Badge key={tag} className="bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/20">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 hover:text-red-400"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            ))}
                            {CLIENT_TAGS.map((tag) => (
                                !selectedTags.includes(tag) && (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="cursor-pointer border-white/10 text-muted-foreground hover:bg-white/5"
                                        onClick={() => setSelectedTags([...selectedTags, tag])}
                                    >
                                        + {tag}
                                    </Badge>
                                )
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                onValueChange={(value) => setValue('status', value)}
                                defaultValue={client?.status || 'active'}
                                disabled={updateClient.isPending}
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

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                onValueChange={(value) => setValue('priority', value)}
                                defaultValue={client?.priority || 'medium'}
                                disabled={updateClient.isPending}
                            >
                                <SelectTrigger className="bg-white/[0.02] border-white/10 text-white">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0B132B] border-white/10">
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="preferred_contact">Preferred Contact</Label>
                            <Select
                                onValueChange={(value) => setValue('preferred_contact', value)}
                                defaultValue={client?.preferred_contact || 'email'}
                                disabled={updateClient.isPending}
                            >
                                <SelectTrigger className="bg-white/[0.02] border-white/10 text-white">
                                    <SelectValue placeholder="Select contact method" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0B132B] border-white/10">
                                    {CONTACT_METHODS.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {method.charAt(0).toUpperCase() + method.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assigned_to">Assigned To</Label>
                            <Select
                                onValueChange={(value) => setValue('assigned_to', value)}
                                defaultValue={client?.assigned_to ? String(client.assigned_to) : ''}
                                disabled={updateClient.isPending}
                            >
                                <SelectTrigger className="bg-white/[0.02] border-white/10 text-white">
                                    <SelectValue placeholder="Assign to user" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0B132B] border-white/10">
                                    <SelectItem value="">Unassigned</SelectItem>
                                    {users?.users?.map((user) => (
                                        <SelectItem key={user.id} value={String(user.id)}>
                                            {user.first_name} {user.last_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground min-h-[80px]"
                            {...register('notes')}
                            disabled={updateClient.isPending}
                        />
                    </div>

                    {/* Billing Information */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#7C3AED]">Billing Information</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="billing_contact">Billing Contact</Label>
                                <Input
                                    id="billing_contact"
                                    className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                    {...register('billing_contact')}
                                    disabled={updateClient.isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payment_terms">Payment Terms</Label>
                                <Input
                                    id="payment_terms"
                                    className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                    {...register('payment_terms')}
                                    disabled={updateClient.isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Input
                                    id="currency"
                                    className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                    {...register('currency')}
                                    disabled={updateClient.isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tax_number">Tax Number</Label>
                                <Input
                                    id="tax_number"
                                    className="bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                                    {...register('tax_number')}
                                    disabled={updateClient.isPending}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => {
                                onOpenChange(false)
                                reset()
                                setSelectedTags(client?.tags || [])
                            }}
                            disabled={updateClient.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
                            disabled={updateClient.isPending}
                        >
                            {updateClient.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Client'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}