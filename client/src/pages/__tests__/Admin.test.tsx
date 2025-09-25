import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { memoryLocation } from "wouter/memory-location";
import { Router } from "wouter";
import AdminDashboard from "../AdminDashboard";
import AllProducts from "../AllProducts";
import AddProduct from "../AddProduct";
import EditProduct from "../EditProduct";
import AllCategories from "../AllCategories";
import AddCategory from "../AddCategory";
import EditCategory from "../EditCategory";
import * as useAdmin from "@/hooks/admin/useAdmin";

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// Mock fetch
global.fetch = vi.fn();

// Helper function to create complete UseQueryResult mock
const createMockQueryResult = (data: any, isLoading = false, error: any = null) => ({
    data,
    isLoading,
    error,
    isError: !!error,
    isPending: isLoading,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: !error && !isLoading,
    status: error ? 'error' as const : isLoading ? 'pending' as const : 'success' as const,
    fetchStatus: 'idle' as const,
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: error ? Date.now() : 0,
    failureCount: error ? 1 : 0,
    failureReason: error,
    errorUpdateCount: error ? 1 : 0,
    isFetched: !isLoading,
    isFetchedAfterMount: !isLoading,
    isFetching: isLoading,
    isInitialLoading: isLoading,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: vi.fn(),
    remove: vi.fn()
});

describe("Admin System", () => {
    describe("Products", () => {
        it("should display a list of products", async () => {
            const mockProducts = [
                { id: 1, name: "Product 1", sku: "P001", price: "10.00", inventoryQuantity: 100, isAvailable: true, category: { name: "Category 1" } },
                { id: 2, name: "Product 2", sku: "P002", price: "20.00", inventoryQuantity: 50, isAvailable: true, category: { name: "Category 2" } },
            ];
            vi.spyOn(useAdmin, 'useProducts').mockReturnValue(createMockQueryResult(
                { success: true, data: { data: mockProducts, pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNext: false, hasPrev: false } } }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/products" });
            render(
                <Router hook={hook}>
                    <AllProducts />
                </Router>
            );

            expect(await screen.findByText("Product 1")).toBeInTheDocument();
            expect(await screen.findByText("Product 2")).toBeInTheDocument();
        });

        it("should add a new product", async () => {
            vi.spyOn(useAdmin, 'useProducts').mockReturnValue(createMockQueryResult(
                { success: true, data: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false } } }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/products/add" });
            render(
                <Router hook={hook}>
                    <AddProduct />
                </Router>
            );
        
            const newProduct = { id: 1, name: "New Product" };
            vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(newProduct) } as Response);
        
            fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: "New Product" } });
            fireEvent.click(screen.getByRole('button', { name: /save product/i }));
        
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith("/api/admin/products", expect.any(Object));
            });
        });

        it("should edit an existing product", async () => {
            const mockProduct = { id: 1, name: "Product 1" };
            vi.spyOn(useAdmin, 'useProducts').mockReturnValue(createMockQueryResult(
                { success: true, data: { data: [mockProduct], pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false } } }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/products/edit/1" });
            render(
                <Router hook={hook}>
                    <EditProduct />
                </Router>
            );
        
            const updatedProduct = { ...mockProduct, name: "Updated Product" };
            vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(updatedProduct) } as Response);
        
            fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: "Updated Product" } });
            fireEvent.click(screen.getByRole('button', { name: /save product/i }));
        
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith("/api/admin/products/1", expect.any(Object));
            });
        });

        it("should delete an existing product", async () => {
            const mockProduct = { id: 1, name: "Product 1" };
            vi.spyOn(useAdmin, 'useProducts').mockReturnValue(createMockQueryResult(
                { success: true, data: { data: [mockProduct], pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false } } }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/products" });
            render(
                <Router hook={hook}>
                    <AllProducts />
                </Router>
            );
        
            const deleteButton = await screen.findByRole('button', { name: /delete/i });
            fireEvent.click(deleteButton);
        
            vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
        
            window.confirm = vi.fn(() => true);
        
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith("/api/admin/products/1", expect.any(Object));
            });
        });
    });

    describe("Categories", () => {
        it("should display a list of categories", async () => {
            const mockCategories = [
                { id: 1, name: "Category 1", description: "Description 1", productsCount: 1 },
                { id: 2, name: "Category 2", description: "Description 2", productsCount: 1 },
            ];
            vi.spyOn(useAdmin, 'useCategories').mockReturnValue(createMockQueryResult(
                { success: true, data: mockCategories }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/categories" });
            render(
                <Router hook={hook}>
                    <AllCategories />
                </Router>
            );

            expect(await screen.findByText("Category 1")).toBeInTheDocument();
            expect(await screen.findByText("Category 2")).toBeInTheDocument();
        });

        it("should add a new category", async () => {
            vi.spyOn(useAdmin, 'useCategories').mockReturnValue(createMockQueryResult(
                { success: true, data: [] }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/categories/add" });
            render(
                <Router hook={hook}>
                    <AddCategory />
                </Router>
            );
        
            const newCategory = { id: 1, name: "New Category" };
            vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(newCategory) } as Response);
        
            fireEvent.change(screen.getByLabelText(/category name/i), { target: { value: "New Category" } });
            fireEvent.click(screen.getByRole('button', { name: /save category/i }));
        
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith("/api/admin/categories", expect.any(Object));
            });
        });

        it("should edit an existing category", async () => {
            const mockCategory = { id: 1, name: "Category 1" };
            vi.spyOn(useAdmin, 'useCategories').mockReturnValue(createMockQueryResult(
                { success: true, data: [mockCategory] }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/categories/edit/1" });
            render(
                <Router hook={hook}>
                    <EditCategory />
                </Router>
            );
        
            const updatedCategory = { ...mockCategory, name: "Updated Category" };
            vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(updatedCategory) } as Response);
        
            fireEvent.change(screen.getByLabelText(/category name/i), { target: { value: "Updated Category" } });
            fireEvent.click(screen.getByRole('button', { name: /save category/i }));
        
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith("/api/admin/categories/1", expect.any(Object));
            });
        });

        it("should delete an existing category", async () => {
            const mockCategory = { id: 1, name: "Category 1" };
            vi.spyOn(useAdmin, 'useCategories').mockReturnValue(createMockQueryResult(
                { success: true, data: [mockCategory] }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/categories" });
            render(
                <Router hook={hook}>
                    <AllCategories />
                </Router>
            );
        
            const deleteButton = await screen.findByRole('button', { name: /delete/i });
            fireEvent.click(deleteButton);
        
            vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
        
            window.confirm = vi.fn(() => true);
        
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith("/api/admin/categories/1", expect.any(Object));
            });
        });
    });

    describe("Orders", () => {
        it("should display a list of orders", async () => {
            const mockOrders = [
                { id: 1, orderNumber: "123", customer: { name: "John Doe" }, total: "100.00", status: "pending" },
                { id: 2, orderNumber: "456", customer: { name: "Jane Doe" }, total: "200.00", status: "shipped" },
            ];
            vi.spyOn(useAdmin, 'useOrders').mockReturnValue(createMockQueryResult(
                { success: true, data: { data: mockOrders, pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNext: false, hasPrev: false } } }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/orders" });
            render(
                <Router hook={hook}>
                    <AdminDashboard />
                </Router>
            );

            const ordersLink = screen.getByRole('link', { name: /orders/i });
            fireEvent.click(ordersLink);

            expect(await screen.findByText("123")).toBeInTheDocument();
            expect(await screen.findByText("456")).toBeInTheDocument();
        });
    });

    describe("Customers", () => {
        it("should display a list of customers", async () => {
            const mockCustomers = [
                { id: 1, name: "John Doe", email: "john.doe@example.com" },
                { id: 2, name: "Jane Doe", email: "jane.doe@example.com" },
            ];
            vi.spyOn(useAdmin, 'useCustomers').mockReturnValue(createMockQueryResult(
                { success: true, data: { data: mockCustomers, pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNext: false, hasPrev: false } } }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/customers" });
            render(
                <Router hook={hook}>
                    <AdminDashboard />
                </Router>
            );

            const customersLink = screen.getByRole('link', { name: /customers/i });
            fireEvent.click(customersLink);

            expect(await screen.findByText("John Doe")).toBeInTheDocument();
            expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
        });
    });

    describe("Coupons", () => {
        it("should display a list of coupons", async () => {
            const mockCoupons = [
                { id: 1, code: "SUMMER10", type: "percentage", value: 10 },
                { id: 2, code: "FALL20", type: "fixed", value: 20 },
            ];
            vi.spyOn(useAdmin, 'useCoupons').mockReturnValue(createMockQueryResult(
                { success: true, data: { data: mockCoupons, pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNext: false, hasPrev: false } } }
            ) as any);

            const { hook } = memoryLocation({ path: "/admin/coupons" });
            render(
                <Router hook={hook}>
                    <AdminDashboard />
                </Router>
            );

            const couponsLink = screen.getByRole('link', { name: /coupons/i });
            fireEvent.click(couponsLink);

            expect(await screen.findByText("SUMMER10")).toBeInTheDocument();
            expect(await screen.findByText("FALL20")).toBeInTheDocument();
        });
    });
});