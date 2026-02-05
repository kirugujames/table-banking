import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Eye, Loader2, CreditCard, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { loanService } from '@/app/lib/loan-service';
import { CreateLoanProductModal } from '@/app/components/create-loan-product-modal';
import { toast } from 'react-hot-toast';

export function LoanProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await loanService.getAllLoanProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching loan products:', error);
            toast.error('Failed to load loan products');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search loan products..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                    />
                </div>
                <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Create Loan Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Available Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>Interest Rate</TableHead>
                                            <TableHead>Period</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Max Repayment</TableHead>
                                            <TableHead>Requires Guarantor</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedProducts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                    {searchQuery ? "No products found matching your search." : "No loan products found."}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedProducts.map((product) => (
                                                <TableRow key={product.name}>
                                                    <TableCell className="font-medium">{product.product_name}</TableCell>
                                                    <TableCell>{product.interest_rate}%</TableCell>
                                                    <TableCell>{product.interest_period}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{product.interest_method}</Badge>
                                                    </TableCell>
                                                    <TableCell>{product.max_repayment_period} Months</TableCell>
                                                    <TableCell>
                                                        <Badge variant={product.requires_guarantor ? "default" : "secondary"}>
                                                            {product.requires_guarantor ? "Yes" : "No"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <div className="text-sm font-medium">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <CreateLoanProductModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSuccess={fetchProducts}
            />
        </div>
    );
}
