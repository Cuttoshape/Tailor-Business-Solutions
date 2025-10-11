"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import apiClient from "@/lib/api";
import BusinessBanner from "@/components/BusinessBanner";
import AddProductModal from "./AddProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
import SearchAndFilters from "./SearchAndFilters";
import MaterialsList from "./MaterialsList";
import { useParams } from "next/navigation";

// Define types
export type FabricType = { name: string; cost: number };

export interface ProductOptions {
  availableColors?: string[];
  availableDesigns?: string[];
  fabricTypes?: FabricType[];
  [key: string]: unknown;
}

export type EntityType = "PRODUCT" | "ORDER" | "BUSINESS" | "USER";

export interface DocumentRecord {
  id: string; // UUID
  entityType: EntityType;
  entityId: string; // UUID of the owning entity
  url: string; // public URL to the file
  mimeType: string; // e.g., "image/png"
  fileName: string; // e.g., "7.png"
  createdAt: string; // ISO timestamp (e.g., "2025-10-10T17:21:38.000Z")
  updatedAt: string; // ISO timestamp
}

export interface Product {
  id: string;
  name: string;
  businessId: string;
  options: ProductOptions;
  description?: string | null;
  documents?: DocumentRecord[];
  lowPrice: number;
  highPrice: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: string; // Added for Product Details Modal
  supplier?: string;
  quantity?: number;
  minStock?: number;
  costPerUnit?: number;
  location?: string;
  status?: string;
}

export interface NewProduct {
  name: string;
  description: string;
  images: string[];
  fabricTypes: FabricType[];
  availableColors: string[];
  availableDesigns: string[];
}

export default function TailorInventory() {
  const [businessId, setBusinessId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { bussId } = useParams();

  const raw =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = raw ? (JSON.parse(raw) as { businessId?: string }) : null;

  useEffect(() => {
    if (bussId) {
      if (typeof bussId === "string") setBusinessId(bussId);
    } else {
      if (user?.businessId) {
        setBusinessId(user.businessId);
      }
    }
  }, [bussId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result: any = await apiClient.products.getMyAll({
        businessId: businessId,
        search: searchQuery,
        page: page.toString(),
        limit: "20",
      });

      setProducts(result.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) fetchProducts();
  }, [searchQuery, page, businessId]);

  const handleViewDetails = (item: Product) => {
    setShowDetailsModal(true);
    setSelectedProduct(item);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="w-8 h-8 flex items-center justify-center">
              <i className="ri-arrow-left-line text-xl text-gray-600"></i>
            </Link>
            <h1 className="text-lg font-semibold">My Shop</h1>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center active:scale-95"
              aria-label="Add new item"
              type="button"
            >
              <i className="ri-add-line text-white"></i>
            </button>
          </div>
        </div>
      </header>

      <div className="pt-16 pb-6">
        {/* Business Banner */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-xl p-2">
              <BusinessBanner businessId={businessId} />
            </div>
          </div>
        </div>

        <div className="px-4">
          <SearchAndFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <MaterialsList
            products={products}
            handleViewDetails={handleViewDetails}
            handleEditProduct={(product) => {
              setSelectedProduct(product);
              setShowEditProductModal(true);
            }}
          />
        </div>
      </div>

      {showAddProductModal && (
        <AddProductModal
          show={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          fileInputRef={fileInputRef}
          setShowAddProductModal={setShowAddProductModal}
          fetchProducts={fetchProducts}
          mode="add"
        />
      )}

      {showEditProductModal && (
        <AddProductModal
          show={showEditProductModal}
          onClose={() => setShowEditProductModal(false)}
          fileInputRef={fileInputRef}
          setShowAddProductModal={setShowEditProductModal}
          fetchProducts={fetchProducts}
          mode="edit"
        />
      )}

      {showDetailsModal && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
