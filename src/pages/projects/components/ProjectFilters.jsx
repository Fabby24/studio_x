import { Search, Filter, X } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
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
} from '../../../config/projectConstants';

const ProjectFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    priority,
    onPriorityChange,
    projectType,
    onProjectTypeChange,
    department,
    onDepartmentChange,
    healthStatus,
    onHealthStatusChange,
    showArchived,
    onShowArchivedChange,
    onClearFilters,
    hasFilters,
}) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search projects by name or code..."
                    className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-[130px] bg-card border-border text-foreground">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        <SelectItem value="">All Status</SelectItem>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={priority} onValueChange={onPriorityChange}>
                    <SelectTrigger className="w-[130px] bg-card border-border text-foreground">
                        <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        <SelectItem value="">All Priority</SelectItem>
                        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={projectType} onValueChange={onProjectTypeChange}>
                    <SelectTrigger className="w-[140px] bg-card border-border text-foreground">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        <SelectItem value="">All Types</SelectItem>
                        {Object.entries(TYPE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={department} onValueChange={onDepartmentChange}>
                    <SelectTrigger className="w-[140px] bg-card border-border text-foreground">
                        <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        <SelectItem value="">All Departments</SelectItem>
                        {Object.entries(DEPARTMENT_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={healthStatus} onValueChange={onHealthStatusChange}>
                    <SelectTrigger className="w-[140px] bg-card border-border text-foreground">
                        <SelectValue placeholder="All Health" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        <SelectItem value="">All Health</SelectItem>
                        {Object.entries(HEALTH_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={onClearFilters}
                    >
                        <X className="mr-1 h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProjectFilters;