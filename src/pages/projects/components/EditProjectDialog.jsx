import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, Plus } from 'lucide-react';
import { updateProjectSchema } from '../../../schemas/projectSchema';
import { useUpdateProject } from '../../../hooks/useProjects';
import { useUsers } from '../../../hooks/useUsers';
import { useClients } from '../../../hooks/useClients';
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
import { Textarea } from '../../../components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import {
    PROJECT_STATUS,
    PROJECT_PRIORITY,
    PROJECT_TYPE,
    DEPARTMENT,
    HEALTH_STATUS,
    STATUS_LABELS,
    PRIORITY_LABELS,
    TYPE_LABELS,
    DEPARTMENT_LABELS,
    HEALTH_LABELS,
    PROJECT_COLORS,
    DEFAULT_PROJECT_COLOR,
} from '../../../config/projectConstants';

const EditProjectDialog = ({ open, onOpenChange, project, onSuccess }) => {
    const [selectedColor, setSelectedColor] = useState(DEFAULT_PROJECT_COLOR);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
    const updateProject = useUpdateProject();
    const { data: users } = useUsers({ limit: 100 });
    const { data: clients } = useClients({ limit: 100 });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
        clearErrors,
    } = useForm({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            name: '',
            client_id: '',
            description: '',
            status: 'planning',
            priority: 'medium',
            project_type: 'web_design',
            department: 'design',
            health_status: 'on_track',
            start_date: '',
            due_date: '',
            delivery_date: '',
            estimated_hours: '',
            actual_hours: '',
            budget: '',
            completion_percentage: 0,
            color: DEFAULT_PROJECT_COLOR,
            billable: true,
            is_internal: false,
            project_notes: '',
            manager_id: '',
            team_member_ids: [],
        },
    });

    const watchCompletion = watch('completion_percentage');

    useEffect(() => {
        if (project) {
            const teamMemberIds = project.team_members?.map(tm => tm.user_id) || [];
            setSelectedTeamMembers(teamMemberIds);
            setSelectedColor(project.color || DEFAULT_PROJECT_COLOR);

            reset({
                name: project.name || '',
                client_id: project.client_id || '',
                description: project.description || '',
                status: project.status || 'planning',
                priority: project.priority || 'medium',
                project_type: project.project_type || 'web_design',
                department: project.department || 'design',
                health_status: project.health_status || 'on_track',
                start_date: project.start_date ? project.start_date.split('T')[0] : '',
                due_date: project.due_date ? project.due_date.split('T')[0] : '',
                delivery_date: project.delivery_date ? project.delivery_date.split('T')[0] : '',
                estimated_hours: project.estimated_hours || '',
                actual_hours: project.actual_hours || '',
                budget: project.budget || '',
                completion_percentage: project.completion_percentage || 0,
                color: project.color || DEFAULT_PROJECT_COLOR,
                billable: project.billable !== undefined ? project.billable : true,
                is_internal: project.is_internal !== undefined ? project.is_internal : false,
                project_notes: project.project_notes || '',
                manager_id: project.manager_id || '',
                team_member_ids: teamMemberIds,
            });
        }
    }, [project, reset]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setValue('color', color);
        clearErrors('color');
    };

    const handleTeamMemberToggle = (userId) => {
        setSelectedTeamMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
        setValue('team_member_ids', selectedTeamMembers);
    };

    const onSubmit = async (data) => {
        try {
            const formData = {
                ...data,
                color: selectedColor,
                team_member_ids: selectedTeamMembers,
                estimated_hours: data.estimated_hours ? parseFloat(data.estimated_hours) : null,
                actual_hours: data.actual_hours ? parseFloat(data.actual_hours) : null,
                budget: data.budget ? parseFloat(data.budget) : null,
                completion_percentage: data.completion_percentage ? parseInt(data.completion_percentage) : 0,
            };

            await updateProject.mutateAsync({ id: project.id, data: formData });
            onSuccess?.();
        } catch (error) {
            // Error handled by service
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border text-foreground max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Update project details and settings.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Basic Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="name">Project Name *</Label>
                                <Input
                                    id="name"
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                                    {...register('name')}
                                    disabled={updateProject.isLoading}
                                    aria-invalid={!!errors.name}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-400">{errors.name.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="client_id">Client</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue('client_id', value || '');
                                        clearErrors('client_id');
                                    }}
                                    defaultValue={project?.client_id || ''}
                                    disabled={updateProject.isLoading}
                                >
                                    <SelectTrigger className="bg-card border-border text-foreground">
                                        <SelectValue placeholder="Select client" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="">No Client</SelectItem>
                                        {clients?.clients?.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="project_type">Project Type</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue('project_type', value);
                                        clearErrors('project_type');
                                    }}
                                    defaultValue={project?.project_type || 'web_design'}
                                    disabled={updateProject.isLoading}
                                >
                                    <SelectTrigger className="bg-card border-border text-foreground">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {Object.entries(TYPE_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue('department', value);
                                        clearErrors('department');
                                    }}
                                    defaultValue={project?.department || 'design'}
                                    disabled={updateProject.isLoading}
                                >
                                    <SelectTrigger className="bg-card border-border text-foreground">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {Object.entries(DEPARTMENT_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="color">Project Color</Label>
                                <div className="flex flex-wrap gap-2">
                                    {PROJECT_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`h-8 w-8 rounded-full border-2 transition-all ${
                                                selectedColor === color
                                                    ? 'border-primary scale-110'
                                                    : 'border-transparent hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleColorSelect(color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
                                {...register('description')}
                                disabled={updateProject.isLoading}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-400">{errors.description.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Status & Priority */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Status & Priority</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue('status', value);
                                        clearErrors('status');
                                    }}
                                    defaultValue={project?.status || 'planning'}
                                    disabled={updateProject.isLoading}
                                >
                                    <SelectTrigger className="bg-card border-border text-foreground">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue('priority', value);
                                        clearErrors('priority');
                                    }}
                                    defaultValue={project?.priority || 'medium'}
                                    disabled={updateProject.isLoading}
                                >
                                    <SelectTrigger className="bg-card border-border text-foreground">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="health_status">Health Status</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue('health_status', value);
                                        clearErrors('health_status');
                                    }}
                                    defaultValue={project?.health_status || 'on_track'}
                                    disabled={updateProject.isLoading}
                                >
                                    <SelectTrigger className="bg-card border-border text-foreground">
                                        <SelectValue placeholder="Select health" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {Object.entries(HEALTH_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="completion_percentage">Progress</Label>
                                <div className="space-y-2">
                                    <Input
                                        id="completion_percentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="bg-card border-border text-foreground"
                                        {...register('completion_percentage', { valueAsNumber: true })}
                                        disabled={updateProject.isLoading}
                                    />
                                    <Progress value={watchCompletion || 0} className="h-2 bg-muted" />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {watchCompletion || 0}% complete
                                    </p>
                                </div>
                                {errors.completion_percentage && (
                                    <p className="text-sm text-red-400">{errors.completion_percentage.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Planning Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Planning</h3>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    className="bg-card border-border text-foreground"
                                    {...register('start_date')}
                                    disabled={updateProject.isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    className="bg-card border-border text-foreground"
                                    {...register('due_date')}
                                    disabled={updateProject.isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="delivery_date">Delivery Date</Label>
                                <Input
                                    id="delivery_date"
                                    type="date"
                                    className="bg-card border-border text-foreground"
                                    {...register('delivery_date')}
                                    disabled={updateProject.isLoading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="estimated_hours">Estimated Hours</Label>
                                <Input
                                    id="estimated_hours"
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    placeholder="0"
                                    className="bg-card border-border text-foreground"
                                    {...register('estimated_hours', { valueAsNumber: true })}
                                    disabled={updateProject.isLoading}
                                />
                                {errors.estimated_hours && (
                                    <p className="text-sm text-red-400">{errors.estimated_hours.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="actual_hours">Actual Hours</Label>
                                <Input
                                    id="actual_hours"
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    placeholder="0"
                                    className="bg-card border-border text-foreground"
                                    {...register('actual_hours', { valueAsNumber: true })}
                                    disabled={updateProject.isLoading}
                                />
                                {errors.actual_hours && (
                                    <p className="text-sm text-red-400">{errors.actual_hours.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget</Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="bg-card border-border text-foreground"
                                    {...register('budget', { valueAsNumber: true })}
                                    disabled={updateProject.isLoading}
                                />
                                {errors.budget && (
                                    <p className="text-sm text-red-400">{errors.budget.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Team</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="manager_id">Project Manager</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setValue('manager_id', value || '');
                                        clearErrors('manager_id');
                                    }}
                                    defaultValue={project?.manager_id || ''}
                                    disabled={updateProject.isLoading}
                                >
                                    <SelectTrigger className="bg-card border-border text-foreground">
                                        <SelectValue placeholder="Assign manager" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="">Unassigned</SelectItem>
                                        {users?.users?.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.first_name} {user.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Team Members</Label>
                            <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-card min-h-[60px]">
                                {selectedTeamMembers.length === 0 ? (
                                    <span className="text-sm text-muted-foreground">No team members selected</span>
                                ) : (
                                    selectedTeamMembers.map((userId) => {
                                        const user = users?.users?.find(u => u.id === userId);
                                        return user ? (
                                            <Badge key={userId} className="bg-primary/10 text-primary border-primary/20">
                                                {user.first_name} {user.last_name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleTeamMemberToggle(userId)}
                                                    className="ml-1 hover:text-red-400"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ) : null;
                                    })
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {users?.users?.map((user) => (
                                    !selectedTeamMembers.includes(user.id) && (
                                        <Badge
                                            key={user.id}
                                            variant="outline"
                                            className="cursor-pointer border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                            onClick={() => handleTeamMemberToggle(user.id)}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            {user.first_name} {user.last_name}
                                        </Badge>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Additional Settings</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="billable"
                                    className="h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary"
                                    {...register('billable')}
                                    disabled={updateProject.isLoading}
                                />
                                <Label htmlFor="billable" className="text-sm font-normal cursor-pointer">
                                    Billable Project
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_internal"
                                    className="h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary"
                                    {...register('is_internal')}
                                    disabled={updateProject.isLoading}
                                />
                                <Label htmlFor="is_internal" className="text-sm font-normal cursor-pointer">
                                    Internal Project
                                </Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="project_notes">Project Notes</Label>
                            <Textarea
                                id="project_notes"
                                className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
                                {...register('project_notes')}
                                disabled={updateProject.isLoading}
                            />
                            {errors.project_notes && (
                                <p className="text-sm text-red-400">{errors.project_notes.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-border text-foreground hover:bg-accent"
                            onClick={() => onOpenChange(false)}
                            disabled={updateProject.isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90"
                            disabled={updateProject.isLoading}
                        >
                            {updateProject.isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Project'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProjectDialog;