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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Users as UsersIcon, X, Shield, MoreVertical, UserCheck, UserMinus } from 'lucide-react';
import { userService, User, Role } from '@/app/lib/user-service';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form state
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [roleSearchTerm, setRoleSearchTerm] = useState('');

    // Roles dialog state
    const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await userService.getAllRoles();
            setRoles(data);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleCreateUser = async () => {
        if (!email.trim() || !firstName.trim() || !lastName.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);
            await userService.createUser({
                email,
                first_name: firstName,
                last_name: lastName,
                roles: selectedRoles,
            });
            toast.success(`User '${email}' created successfully`);
            setIsCreateModalOpen(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Failed to create user:', error);
            toast.error('Failed to create user');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleUserStatus = async (user: User) => {
        const newStatus = user.enabled === 1 ? 'Disabled' : 'Enabled';
        try {
            setIsLoading(true);
            const result = await userService.setUserStatus(user.name, newStatus);
            if (result.status === 'success') {
                toast.success(result.message || `User ${newStatus.toLowerCase()} successfully`);
                fetchUsers();
            } else {
                toast.error(result.message || `Failed to update user status`);
            }
        } catch (error) {
            console.error('Failed to toggle user status:', error);
            toast.error('An error occurred while updating status');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setFirstName('');
        setLastName('');
        setSelectedRoles([]);
        setRoleSearchTerm('');
    };

    const addRole = (roleName: string) => {
        if (!selectedRoles.includes(roleName)) {
            setSelectedRoles([...selectedRoles, roleName]);
        }
        setRoleSearchTerm('');
    };

    const removeRole = (roleName: string) => {
        setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
    };

    const filteredRoles = roles.filter(
        (role) =>
            role.role_name.toLowerCase().includes(roleSearchTerm.toLowerCase()) &&
            !selectedRoles.includes(role.role_name)
    );

    // Pagination
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = users.slice(startIndex, endIndex);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground">Manage system users and their roles</p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl lg:max-w-[50vw] max-h-[90vh] overflow-y-auto [&>button:last-child]:top-6 [&>button:last-child]:right-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <UsersIcon className="h-5 w-5" />
                                Create New User
                            </DialogTitle>
                            <DialogDescription>
                                Add a new user to the system. Assign roles to define their permissions.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold border-b pb-2">Basic Information</h3>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first-name">First Name *</Label>
                                        <Input
                                            id="first-name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last-name">Last Name *</Label>
                                        <Input
                                            id="last-name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Roles */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold border-b pb-2">Roles & Permissions</h3>
                                <div className="grid gap-2">
                                    <Label>Assigned Roles</Label>
                                    <div className="space-y-2">
                                        {/* Selected Roles */}
                                        {selectedRoles.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50 min-h-[100px] content-start">
                                                {selectedRoles.map((role) => (
                                                    <Badge key={role} variant="secondary" className="gap-1 h-fit">
                                                        {role}
                                                        <button
                                                            onClick={() => removeRole(role)}
                                                            className="ml-1 hover:bg-destructive/20 rounded-full"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center p-4 border border-dashed rounded-md bg-muted/30 text-xs text-muted-foreground min-h-[100px]">
                                                No roles assigned yet
                                            </div>
                                        )}
                                        {/* Role Search */}
                                        <div className="relative">
                                            <Input
                                                placeholder="Search and select roles..."
                                                value={roleSearchTerm}
                                                onChange={(e) => setRoleSearchTerm(e.target.value)}
                                            />
                                            {/* Role Suggestions */}
                                            {roleSearchTerm && filteredRoles.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 z-[60] mt-1 border rounded-md bg-popover text-popover-foreground shadow-md max-h-40 overflow-y-auto">
                                                    {filteredRoles.slice(0, 5).map((role) => (
                                                        <button
                                                            key={role.name}
                                                            onClick={() => addRole(role.role_name)}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                                                        >
                                                            {role.role_name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleCreateUser} disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UsersIcon className="h-5 w-5" />
                        All Users
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && users.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">Loading users...</div>
                    ) : users.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">No users found</div>
                    ) : (
                        <>
                            <div className="border rounded-md overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Full Name</TableHead>
                                            <TableHead>User Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Roles</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentUsers.map((user) => (
                                            <TableRow key={user.name}>
                                                <TableCell className="font-medium">{user.email}</TableCell>
                                                <TableCell>{user.full_name}</TableCell>
                                                <TableCell>{user.user_type}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.enabled === 1 ? 'default' : 'secondary'}>
                                                        {user.enabled === 1 ? 'Active' : 'Disabled'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setSelectedUser(user);
                                                            setIsRolesDialogOpen(true);
                                                        }}
                                                        className="flex flex-wrap gap-1 max-w-xs hover:opacity-80 transition-opacity cursor-pointer"
                                                    >
                                                        {user.roles.slice(0, 2).map((role) => (
                                                            <Badge key={role} variant="outline" className="text-xs">
                                                                {role}
                                                            </Badge>
                                                        ))}
                                                        {user.roles.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{user.roles.length - 2}
                                                            </Badge>
                                                        )}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {format(new Date(user.creation), 'MMM dd, yyyy')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setIsRolesDialogOpen(true);
                                                                }}
                                                            >
                                                                <Shield className="mr-2 h-4 w-4" />
                                                                View Roles
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleToggleUserStatus(user)}
                                                            >
                                                                {user.enabled === 1 ? (
                                                                    <>
                                                                        <UserMinus className="mr-2 h-4 w-4 text-orange-600" />
                                                                        <span>Disable User</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                                                        <span>Enable User</span>
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
                                        Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users
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

            {/* Roles Dialog */}
            <Dialog open={isRolesDialogOpen} onOpenChange={setIsRolesDialogOpen}>
                <DialogContent className="max-w-4xl lg:max-w-[50vw] max-h-[90vh] overflow-y-auto [&>button:last-child]:top-6 [&>button:last-child]:right-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            User Roles
                        </DialogTitle>
                        <DialogDescription>
                            All roles and permissions assigned to {selectedUser?.full_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        {selectedUser && selectedUser.roles.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {selectedUser.roles.map((role) => (
                                    <Badge key={role} variant="secondary" className="text-sm py-1.5 px-4 shadow-sm border-primary/10">
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 border border-dashed rounded-lg">
                                <Shield className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm">No roles assigned to this user</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsRolesDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
