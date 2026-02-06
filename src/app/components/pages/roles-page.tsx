import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/app/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Shield } from 'lucide-react';
import { userService, Role } from '@/app/lib/user-service';
import { toast } from 'sonner';

export function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchRoles = async () => {
        try {
            setIsLoading(true);
            const data = await userService.getAllRoles();
            setRoles(data);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            toast.error('Failed to load roles');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleCreateRole = async () => {
        if (!roleName.trim()) {
            toast.error('Please enter a role name');
            return;
        }

        try {
            setIsLoading(true);
            await userService.createRole({ role_name: roleName });
            toast.success(`Role '${roleName}' created successfully`);
            setIsCreateModalOpen(false);
            setRoleName('');
            fetchRoles();
        } catch (error) {
            console.error('Failed to create role:', error);
            toast.error('Failed to create role');
        } finally {
            setIsLoading(false);
        }
    };

    // Pagination
    const totalPages = Math.ceil(roles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRoles = roles.slice(startIndex, endIndex);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Roles</h1>
                    <p className="text-muted-foreground">Manage system roles and permissions</p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl lg:max-w-[50vw] max-h-[90vh] overflow-y-auto [&>button:last-child]:top-6 [&>button:last-child]:right-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Create New Role
                            </DialogTitle>
                            <DialogDescription>
                                Add a new role to the system. Enter a unique role name.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold border-b pb-2">Role Details</h3>
                                <div className="grid gap-2">
                                    <Label htmlFor="role-name">Role Name</Label>
                                    <Input
                                        id="role-name"
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                        placeholder="e.g., SACCO Teller"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold border-b pb-2">Information</h3>
                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg text-sm text-muted-foreground flex gap-3">
                                    <Shield className="h-5 w-5 text-primary shrink-0" />
                                    <p>Roles define the set of permissions a user has within the system. Ensure the role name is descriptive of the responsibilities.</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateRole} disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Role'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Roles Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        All Roles
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && roles.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">Loading roles...</div>
                    ) : roles.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">No roles found</div>
                    ) : (
                        <>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Role Name</TableHead>
                                            <TableHead>Desk Access</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentRoles.map((role) => (
                                            <TableRow key={role.name}>
                                                <TableCell className="font-medium">{role.role_name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={role.desk_access === 1 ? 'default' : 'secondary'}>
                                                        {role.desk_access === 1 ? 'Yes' : 'No'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {startIndex + 1} to {Math.min(endIndex, roles.length)} of {roles.length} roles
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
