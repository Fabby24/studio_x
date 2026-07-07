import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Download, Upload, Users, Building, Briefcase } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'

import { useClients, useClientStats, useBulkClientAction } from '../../hooks/useClients'
import { INDUSTRIES } from '../../schemas/clientSchema'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog'
import { Skeleton } from '../../components/ui/skeleton'
import { ClientTable } from './components/ClientTable'
import { CreateClientModal } from './components/CreateClientModal'
import { EditClientModal } from './components/EditClientModal'
import { BulkActions } from './components/BulkActions'

const ClientsPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [industryFilter, setIndustryFilter] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [selectedClients, setSelectedClients] = useState([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedClient, setSelectedClient] = useState(null)
    const [clientToArchive, setClientToArchive] = useState(null)

    const debouncedSearch = useDebounce(searchTerm, 500)

    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useClients({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
        industry: industryFilter,
        priority: priorityFilter,
    })

    const { data: stats, isLoading: statsLoading } = useClientStats()
    const bulkAction = useBulkClientAction()

    // Reset page when filters change
    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, statusFilter, industryFilter, priorityFilter])

    const handleArchiveClient = async () => {
        if (clientToArchive) {
            await bulkAction.mutateAsync({
                ids: [clientToArchive.id],
                action: 'archive'
            })
            setIsDeleteDialogOpen(false)
            setClientToArchive(null)
            setSelectedClients([])
        }
    }

    const handleEditClient = (client) => {
        setSelectedClient(client)
        setIsEditModalOpen(true)
    }

    const handleArchiveClick = (client) => {
        setClientToArchive(client)
        setIsDeleteDialogOpen(true)
    }

    const handleBulkAction = async (action) => {
        if (selectedClients.length === 0) return
        await bulkAction.mutateAsync({
            ids: selectedClients,
            action,
        })
        setSelectedClients([])
    }

    // Pagination calculations
    const totalPages = data?.pagination?.totalPages || 0
    const totalClients = data?.pagination?.total || 0

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 font-poppins"
        >
            {/* Page Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold text-[#7C3AED] tracking-wide uppercase">Management</p>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">
                        Manage your client relationships and project pipeline
                    </p>
                </div>
                <Button
                    className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 transition-opacity"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                </Button>
            </div>

            {/* Stats Summary */}
            {statsLoading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 bg-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <Card className="border-white/5 bg-white/[0.02]">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/5 bg-white/[0.02]">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Active</p>
                            <p className="text-2xl font-bold text-green-400">{stats?.active || 0}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/5 bg-white/[0.02]">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Inactive</p>
                            <p className="text-2xl font-bold text-red-400">{stats?.inactive || 0}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/5 bg-white/[0.02]">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">High Priority</p>
                            <p className="text-2xl font-bold text-[#7C3AED]">{stats?.high_priority || 0}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-white/5 bg-white/[0.02]">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Industries</p>
                            <p className="text-2xl font-bold text-[#06B6D4]">{stats?.industries?.length || 0}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters and Actions */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-wrap gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search clients by name, company, or email..."
                            className="pl-9 bg-white/[0.02] border-white/10 text-white placeholder:text-muted-foreground"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px] bg-white/[0.02] border-white/10 text-white">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0B132B] border-white/10">
                            <SelectItem value="">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Industry Filter */}
                    <Select value={industryFilter} onValueChange={setIndustryFilter}>
                        <SelectTrigger className="w-[140px] bg-white/[0.02] border-white/10 text-white">
                            <SelectValue placeholder="All Industries" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0B132B] border-white/10">
                            <SelectItem value="">All Industries</SelectItem>
                            {INDUSTRIES.map((industry) => (
                                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Priority Filter */}
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-[130px] bg-white/[0.02] border-white/10 text-white">
                            <SelectValue placeholder="All Priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0B132B] border-white/10">
                            <SelectItem value="">All Priority</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedClients.length > 0 && (
                <BulkActions
                    selectedCount={selectedClients.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelectedClients([])}
                />
            )}

            {/* Client Table */}
            <Card className="border-white/5 bg-white/[0.02]">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="space-y-2 p-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full bg-white/5" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="p-8 text-center">
                            <p className="text-red-400">Error loading clients: {error?.message}</p>
                            <Button
                                variant="outline"
                                className="mt-4 border-white/10 hover:bg-white/5"
                                onClick={() => refetch()}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : (
                        <ClientTable
                            clients={data?.clients || []}
                            selectedClients={selectedClients}
                            onSelectClient={(clientId) => {
                                setSelectedClients(prev =>
                                    prev.includes(clientId)
                                        ? prev.filter(id => id !== clientId)
                                        : [...prev, clientId]
                                )
                            }}
                            onSelectAll={(clientIds) => {
                                setSelectedClients(
                                    selectedClients.length === clientIds.length
                                        ? []
                                        : clientIds
                                )
                            }}
                            onEdit={handleEditClient}
                            onArchive={handleArchiveClick}
                            onStatusChange={async (client, newStatus) => {
                                const { useUpdateClientStatus } = await import('../../hooks/useClients')
                                const { mutate } = useUpdateClientStatus()
                                mutate({ id: client.id, status: newStatus })
                            }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && totalPages > 0 && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalClients)} of {totalClients} clients
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex gap-1">
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                const pageNum = i + 1
                                return (
                                    <Button
                                        key={i}
                                        variant={page === pageNum ? 'default' : 'outline'}
                                        size="sm"
                                        className={
                                            page === pageNum
                                                ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED]'
                                                : 'border-white/10 hover:bg-white/5'
                                        }
                                        onClick={() => setPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            })}
                            {totalPages > 5 && (
                                <>
                                    <span className="flex items-center px-2 text-muted-foreground">...</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white/10 hover:bg-white/5"
                                        onClick={() => setPage(totalPages)}
                                    >
                                        {totalPages}
                                    </Button>
                                </>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                        <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                            <SelectTrigger className="w-[100px] bg-white/[0.02] border-white/10 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0B132B] border-white/10">
                                <SelectItem value="10">10 / page</SelectItem>
                                <SelectItem value="25">25 / page</SelectItem>
                                <SelectItem value="50">50 / page</SelectItem>
                                <SelectItem value="100">100 / page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Modals */}
            <CreateClientModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={() => {
                    setIsCreateModalOpen(false)
                    refetch()
                }}
            />

            <EditClientModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                client={selectedClient}
                onSuccess={() => {
                    setIsEditModalOpen(false)
                    setSelectedClient(null)
                    refetch()
                }}
            />

            {/* Archive Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-[#0B132B] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Archive Client</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Are you sure you want to archive {clientToArchive?.name}? 
                            The client will be moved to archived and can be restored later.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={handleArchiveClient}
                            disabled={bulkAction.isPending}
                        >
                            {bulkAction.isPending ? 'Archiving...' : 'Archive Client'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}

export default ClientsPage