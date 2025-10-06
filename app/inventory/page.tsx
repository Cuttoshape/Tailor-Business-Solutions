"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@/lib/api";
import BusinessBanner from "@/components/BusinessBanner";

/** ---------- Types ---------- */
type StockStatus = "critical" | "low" | "adequate" | "unknown";

interface MaterialItem {
  id: number;
  name: string;
  category: "fabric" | "buttons" | "thread" | "notions" | "tools";
  supplier: string;
  color: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  minStock: number;
  location: string;
  lastUpdated: string; // ISO or yyyy-mm-dd
  status: StockStatus;
  image: string;
}

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
}

interface NewItem {
  name: string;
  category: "fabric" | "buttons" | "thread" | "notions" | "tools";
  unit: string;
  description: string;
  images: string[]; // preview URLs for UI only
  fabricTypes: { name: string; cost: number }[];
  availableColors: string[];
  availableDesigns: string[];
}

/** ---------- Helpers ---------- */
const computeStatus = (qty: number, min: number): StockStatus => {
  if (qty <= 0) return "critical";
  if (qty < min) return "low";
  return "adequate";
};

const getStatusColor = (status: StockStatus) => {
  switch (status) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "low":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "adequate":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: StockStatus) => {
  switch (status) {
    case "critical":
      return "ri-error-warning-line";
    case "low":
      return "ri-alert-line";
    case "adequate":
      return "ri-checkbox-circle-line";
    default:
      return "ri-question-line";
  }
};

/** ---------- Seed Data ---------- */
const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: 1,
    name: "Premium Cotton Fabric",
    category: "fabric",
    supplier: "Textile World Co.",
    color: "White",
    quantity: 25,
    unit: "yards",
    costPerUnit: 15.5,
    minStock: 10,
    location: "Shelf A-1",
    lastUpdated: "2024-01-15",
    status: "adequate",
    image:
      "https://readdy.ai/api/search-image?query=Premium%20white%20cotton%20fabric%2C%20high%20quality%20textile%2C%20clean%20studio%20lighting%2C%20fabric%20store%20display%2C%20professional%20photography%2C%20isolated%20background&width=100&height=100&seq=fabric1&orientation=squarish",
  },
  {
    id: 2,
    name: "Navy Blue Wool",
    category: "fabric",
    supplier: "Premium Fabrics Ltd.",
    color: "Navy Blue",
    quantity: 8,
    unit: "yards",
    costPerUnit: 28.0,
    minStock: 12,
    location: "Shelf A-2",
    lastUpdated: "2024-01-14",
    status: "low",
    image:
      "https://readdy.ai/api/search-image?query=Navy%20blue%20wool%20fabric%20roll%2C%20premium%20textile%20material%2C%20professional%20fabric%2C%20clean%20studio%20lighting%2C%20high%20quality%20wool%20texture&width=100&height=100&seq=fabric2&orientation=squarish",
  },
  {
    id: 3,
    name: "Black Silk Lining",
    category: "fabric",
    supplier: "Luxury Textiles",
    color: "Black",
    quantity: 15,
    unit: "yards",
    costPerUnit: 22.75,
    minStock: 8,
    location: "Shelf B-1",
    lastUpdated: "2024-01-16",
    status: "adequate",
    image:
      "https://readdy.ai/api/search-image?query=Black%20silk%20fabric%2C%20luxury%20textile%20material%2C%20smooth%20silk%20texture%2C%20professional%20fabric%20photography%2C%20elegant%20display&width=100&height=100&seq=fabric3&orientation=squarish",
  },
  {
    id: 4,
    name: "Mother of Pearl Buttons",
    category: "buttons",
    supplier: "Button Craft Supply",
    color: "White",
    quantity: 150,
    unit: "pieces",
    costPerUnit: 0.85,
    minStock: 50,
    location: "Drawer C-3",
    lastUpdated: "2024-01-12",
    status: "adequate",
    image:
      "https://readdy.ai/api/search-image?query=Mother%20of%20pearl%20buttons%20collection%2C%20white%20elegant%20buttons%2C%20professional%20craft%20supplies%2C%20clean%20studio%20photography%2C%20sewing%20notions%20display&width=100&height=100&seq=buttons1&orientation=squarish",
  },
  {
    id: 5,
    name: "Black Coat Buttons",
    category: "buttons",
    supplier: "Button Craft Supply",
    color: "Black",
    quantity: 28,
    unit: "pieces",
    costPerUnit: 1.25,
    minStock: 40,
    location: "Drawer C-4",
    lastUpdated: "2024-01-10",
    status: "low",
    image:
      "https://readdy.ai/api/search-image?query=Black%20coat%20buttons%20collection%2C%20elegant%20formal%20buttons%2C%20professional%20sewing%20supplies%2C%20studio%20photography%2C%20craft%20materials%20display&width=100&height=100&seq=buttons2&orientation=squarish",
  },
  {
    id: 6,
    name: "Polyester Thread - White",
    category: "thread",
    supplier: "Thread Masters",
    color: "White",
    quantity: 12,
    unit: "spools",
    costPerUnit: 3.5,
    minStock: 5,
    location: "Thread Rack A",
    lastUpdated: "2024-01-13",
    status: "adequate",
    image:
      "https://readdy.ai/api/search-image?query=White%20polyester%20thread%20spools%2C%20professional%20sewing%20thread%2C%20clean%20organized%20display%2C%20craft%20supplies%20photography%2C%20tailoring%20materials&width=100&height=100&seq=thread1&orientation=squarish",
  },
  {
    id: 7,
    name: "Cotton Thread - Navy",
    category: "thread",
    supplier: "Thread Masters",
    color: "Navy Blue",
    quantity: 3,
    unit: "spools",
    costPerUnit: 4.0,
    minStock: 6,
    location: "Thread Rack A",
    lastUpdated: "2024-01-11",
    status: "critical",
    image:
      "https://readdy.ai/api/search-image?query=Navy%20blue%20cotton%20thread%20spools%2C%20professional%20sewing%20thread%2C%20organized%20craft%20supplies%2C%20studio%20photography%2C%20tailoring%20materials%20display&width=100&height=100&seq=thread2&orientation=squarish",
  },
  {
    id: 8,
    name: "Interfacing - Fusible",
    category: "notions",
    supplier: "Sewing Essentials",
    color: "White",
    quantity: 20,
    unit: "yards",
    costPerUnit: 6.75,
    minStock: 15,
    location: "Shelf D-1",
    lastUpdated: "2024-01-14",
    status: "adequate",
    image:
      "https://readdy.ai/api/search-image?query=White%20fusible%20interfacing%20roll%2C%20sewing%20notions%20supplies%2C%20professional%20tailoring%20materials%2C%20clean%20studio%20lighting%2C%20craft%20supplies%20display&width=100&height=100&seq=notions1&orientation=squarish",
  },
  {
    id: 9,
    name: "Measuring Tape",
    category: "tools",
    supplier: "Professional Tools Inc.",
    color: "Yellow",
    quantity: 5,
    unit: "pieces",
    costPerUnit: 12.99,
    minStock: 3,
    location: "Tool Cabinet A",
    lastUpdated: "2024-01-16",
    status: "adequate",
    image:
      "https://readdy.ai/api/search-image?query=Professional%20measuring%20tape%20for%20tailoring%2C%20yellow%20measuring%20tool%2C%20sewing%20equipment%2C%20clean%20studio%20photography%2C%20professional%20tailoring%20tools&width=100&height=100&seq=tools1&orientation=squarish",
  },
  {
    id: 10,
    name: "Fabric Scissors",
    category: "tools",
    supplier: "Sharp Edge Tools",
    color: "Silver",
    quantity: 2,
    unit: "pieces",
    costPerUnit: 45.0,
    minStock: 3,
    location: "Tool Cabinet B",
    lastUpdated: "2024-01-08",
    status: "low",
    image:
      "https://readdy.ai/api/search-image?query=Professional%20fabric%20scissors%2C%20silver%20tailoring%20shears%2C%20sharp%20cutting%20tools%2C%20clean%20studio%20photography%2C%20professional%20sewing%20equipment&width=100&height=100&seq=tools2&orientation=squarish",
  },
];

const SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "Textile World Co.",
    contact: "+1 (555) 123-4567",
    email: "orders@textileworld.com",
  },
  {
    id: 2,
    name: "Premium Fabrics Ltd.",
    contact: "+1 (555) 234-5678",
    email: "sales@premiumfabrics.com",
  },
  {
    id: 3,
    name: "Button Craft Supply",
    contact: "+1 (555) 345-6789",
    email: "info@buttoncraft.com",
  },
  {
    id: 4,
    name: "Thread Masters",
    contact: "+1 (555) 456-7890",
    email: "support@threadmasters.com",
  },
  {
    id: 5,
    name: "Sewing Essentials",
    contact: "+1 (555) 567-8901",
    email: "orders@sewingessentials.com",
  },
];

/** ---------- Component ---------- */
export default function TailorInventory() {
  const [activeTab, setActiveTab] = useState<"materials" | "suppliers">(
    "materials"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | MaterialItem["category"]
  >("all");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null);

  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);

  const [newItem, setNewItem] = useState<NewItem>({
    name: "",
    category: "fabric",
    unit: "yards",
    description: "",
    images: [],
    fabricTypes: [],
    availableColors: [],
    availableDesigns: [],
  });

  // NEW: keep actual files separately for upload
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [newFabricType, setNewFabricType] = useState("");
  const [newFabricCost, setNewFabricCost] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newDesign, setNewDesign] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    { id: "all", name: "All Items" },
    { id: "fabric", name: "Fabrics" },
    { id: "buttons", name: "Buttons" },
    { id: "thread", name: "Thread" },
    { id: "notions", name: "Notions" },
    { id: "tools", name: "Tools" },
  ] as const;

  /** ---------- Derived ---------- */
  const filteredMaterials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return materials.filter((item) => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesStock =
        !showLowStockOnly ||
        item.status === "low" ||
        item.status === "critical";
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [materials, searchQuery, selectedCategory, showLowStockOnly]);

  const lowStockCount = useMemo(
    () =>
      materials.filter((i) => i.status === "low" || i.status === "critical")
        .length,
    [materials]
  );

  const totalValue = useMemo(
    () => materials.reduce((sum, i) => sum + i.quantity * i.costPerUnit, 0),
    [materials]
  );

  /** ---------- Image URL cleanup on unmount ---------- */
  useEffect(() => {
    return () => {
      newItem.images.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [newItem.images]);

  /** ---------- Handlers ---------- */
  const handleAddItem = () => {
    // Revoke previous previews (if any) before resetting
    newItem.images.forEach(
      (url) => url.startsWith("blob:") && URL.revokeObjectURL(url)
    );

    setNewItem({
      name: "",
      category: "fabric",
      unit: "yards",
      description: "",
      images: [],
      fabricTypes: [],
      availableColors: [],
      availableDesigns: [],
    });
    setImageFiles([]); // reset files bucket
    setNewFabricType("");
    setNewFabricCost("");
    setNewColor("");
    setNewDesign("");
    setSelectedImageIndex(0);
    setShowAddItemModal(true);
  };

  const closeAddItemModal = () => {
    // free previews & clear file list
    newItem.images.forEach(
      (url) => url.startsWith("blob:") && URL.revokeObjectURL(url)
    );
    setNewItem((prev) => ({ ...prev, images: [] }));
    setImageFiles([]);
    setShowAddItemModal(false);
  };

  const handleSaveItem = async () => {
    const productPayload = {
      ...newItem,
      images: undefined, // previews are UI-only; omit in payload JSON
      configuration: {
        color: newItem.availableColors,
        design: newItem.availableDesigns,
        fabric: newItem.fabricTypes,
      },
    };

    const formData = new FormData();
    // append JSON as Blob to keep correct Content-Type boundaries
    formData.append(
      "product",
      new Blob([JSON.stringify(productPayload)], { type: "application/json" })
    );

    // append actual files (server may expect "images[]" – adjust if your API differs)
    imageFiles.forEach((file) => formData.append("images[]", file));

    try {
      await apiClient.products.create(formData);
      // Optional: update local list optimistically here

      // cleanup previews and files
      newItem.images.forEach(
        (url) => url.startsWith("blob:") && URL.revokeObjectURL(url)
      );
      setImageFiles([]);
      setShowAddItemModal(false);
    } catch (e) {
      console.error("Failed to save item:", e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = Math.max(0, 6 - newItem.images.length);
    if (remainingSlots === 0) return;

    const incoming = Array.from(files).slice(0, remainingSlots);
    // optional: validate type/size
    // const valid = incoming.filter(f => /^image\//.test(f.type) && f.size <= 8 * 1024 * 1024);

    const urls = incoming.map((f) => URL.createObjectURL(f));

    setNewItem((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));
    setImageFiles((prev) => [...prev, ...incoming]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setNewItem((prev) => {
      const toRevoke = prev.images[index];
      if (toRevoke?.startsWith("blob:")) URL.revokeObjectURL(toRevoke);

      const nextImages = prev.images.filter((_, i) => i !== index);
      const nextSelected =
        nextImages.length === 0
          ? 0
          : Math.min(selectedImageIndex, nextImages.length - 1);
      setSelectedImageIndex(nextSelected);
      return { ...prev, images: nextImages };
    });

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addFabricType = () => {
    const name = newFabricType.trim();
    const costNum = parseFloat(newFabricCost);
    if (!name || !Number.isFinite(costNum)) return;

    setNewItem((prev) => {
      if (
        prev.fabricTypes.some(
          (f) => f.name.toLowerCase() === name.toLowerCase()
        )
      )
        return prev;
      return {
        ...prev,
        fabricTypes: [...prev.fabricTypes, { name, cost: costNum }],
      };
    });
    setNewFabricType("");
    setNewFabricCost("");
  };

  const removeFabricType = (fabricName: string) => {
    setNewItem((prev) => ({
      ...prev,
      fabricTypes: prev.fabricTypes.filter(
        (type) => type.name.toLowerCase() !== fabricName.toLowerCase()
      ),
    }));
  };

  const addColor = () => {
    const v = newColor.trim();
    if (!v) return;
    setNewItem((prev) => {
      if (prev.availableColors.some((c) => c.toLowerCase() === v.toLowerCase()))
        return prev;
      return { ...prev, availableColors: [...prev.availableColors, v] };
    });
    setNewColor("");
  };

  const removeColor = (color: string) => {
    setNewItem((prev) => ({
      ...prev,
      availableColors: prev.availableColors.filter(
        (c) => c.toLowerCase() !== color.toLowerCase()
      ),
    }));
  };

  const addDesign = () => {
    const v = newDesign.trim();
    if (!v) return;
    setNewItem((prev) => {
      if (
        prev.availableDesigns.some((d) => d.toLowerCase() === v.toLowerCase())
      )
        return prev;
      return { ...prev, availableDesigns: [...prev.availableDesigns, v] };
    });
    setNewDesign("");
  };

  const removeDesign = (d: string) =>
    setNewItem((prev) => ({
      ...prev,
      availableDesigns: prev.availableDesigns.filter(
        (x) => x.toLowerCase() !== d.toLowerCase()
      ),
    }));

  const handleUpdateStock = (itemId: number, newQuantity: number) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== itemId) return m;
        const qty = Math.max(0, newQuantity);
        return {
          ...m,
          quantity: qty,
          status: computeStatus(qty, m.minStock),
          lastUpdated: new Date().toISOString(),
        };
      })
    );
  };

  const handleViewDetails = (item: MaterialItem) => setSelectedItem(item);

  /** ---------- Render ---------- */
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
              onClick={handleAddItem}
              className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center active:scale-95"
              aria-label="Add new item"
              type="button"
            >
              <i className="ri-add-line text-white"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="mb-20 fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add New Item</h3>
                <button
                  onClick={closeAddItemModal}
                  className="w-8 h-8 flex items-center justify-center"
                  aria-label="Close add item"
                >
                  <i className="ri-close-line text-gray-400"></i>
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Photos ({newItem.images.length}/6)
                  </label>

                  {/* Main Image Display */}
                  {newItem.images.length > 0 && (
                    <div className="mb-3">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                        <img
                          src={newItem.images[selectedImageIndex]}
                          alt="Item preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Thumbnail Strip */}
                      <div className="flex space-x-2 overflow-x-auto">
                        {newItem.images.map((image, index) => (
                          <div key={index} className="relative flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setSelectedImageIndex(index)}
                              className={`w-12 h-12 rounded border-2 overflow-hidden ${
                                selectedImageIndex === index
                                  ? "border-indigo-600"
                                  : "border-gray-200"
                              }`}
                              aria-label={`Select image ${index + 1}`}
                            >
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                              aria-label={`Remove image ${index + 1}`}
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  {newItem.images.length < 6 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <i className="ri-camera-line text-xl text-gray-400"></i>
                        </div>
                        <p className="text-sm text-gray-600">Upload photos</p>
                        <p className="text-xs text-gray-500">Up to 6 images</p>
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="e.g., Premium Cotton Fabric"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-y"
                    placeholder="e.g., Fabric details, color, notes, special instructions…"
                  />
                </div>

                {/* Fabric Types Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fabric Types ({newItem.fabricTypes.length})
                  </label>

                  {newItem.fabricTypes.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {newItem.fabricTypes.map((fabricType, index) => (
                        <div
                          key={`${fabricType.name}-${index}`}
                          className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <span className="text-sm font-medium text-blue-800">
                              {fabricType.name}
                            </span>
                            <span className="text-xs text-blue-600 ml-2">
                              ${fabricType.cost.toFixed(2)}/yard
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFabricType(fabricType.name)}
                            className="w-6 h-6 text-blue-600 hover:text-blue-800 flex items-center justify-center"
                            aria-label={`Remove ${fabricType.name}`}
                          >
                            <i className="ri-close-line text-sm"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newFabricType}
                        onChange={(e) => setNewFabricType(e.target.value)}
                        placeholder="Fabric name (e.g., Cotton)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={newFabricCost}
                        onChange={(e) => setNewFabricCost(e.target.value)}
                        placeholder="Cost/yard"
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addFabricType}
                      disabled={!newFabricType.trim() || !newFabricCost.trim()}
                      className={`w-full py-2 rounded-lg text-sm font-medium ${
                        newFabricType.trim() && newFabricCost.trim()
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      Add Fabric Type
                    </button>
                  </div>
                </div>

                {/* Available Colors Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Colors ({newItem.availableColors.length})
                  </label>

                  {newItem.availableColors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newItem.availableColors.map((color, index) => (
                        <span
                          key={`${color}-${index}`}
                          className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {color}
                          <button
                            type="button"
                            onClick={() => removeColor(color)}
                            className="ml-1 w-3 h-3 text-green-600 hover:text-green-800"
                            aria-label={`Remove ${color}`}
                          >
                            <i className="ri-close-line text-xs"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="e.g., Navy Blue, White, Black"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addColor();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      disabled={!newColor.trim()}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        newColor.trim()
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Available Designs Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Designs ({newItem.availableDesigns.length})
                  </label>

                  {newItem.availableDesigns.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newItem.availableDesigns.map((design, index) => (
                        <span
                          key={`${design}-${index}`}
                          className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                        >
                          {design}
                          <button
                            type="button"
                            onClick={() => removeDesign(design)}
                            className="ml-1 w-3 h-3 text-purple-600 hover:text-purple-800"
                            aria-label={`Remove ${design}`}
                          >
                            <i className="ri-close-line text-xs"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newDesign}
                      onChange={(e) => setNewDesign(e.target.value)}
                      placeholder="e.g., Floral, Stripes, Plain"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addDesign();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addDesign}
                      disabled={!newDesign.trim()}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        newDesign.trim()
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeAddItemModal}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveItem}
                  disabled={!newItem.name.trim()}
                  className={`flex-1 py-3 rounded-xl font-semibold ${
                    newItem.name.trim()
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Item Details</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 flex items-center justify-center"
                  aria-label="Close details"
                >
                  <i className="ri-close-line text-gray-400"></i>
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden mx-auto mb-3">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold">{selectedItem.name}</h4>
                <p className="text-sm text-gray-600">{selectedItem.color}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">
                    {selectedItem.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier:</span>
                  <span className="font-medium">{selectedItem.supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Stock:</span>
                  <span className="font-medium">
                    {selectedItem.quantity} {selectedItem.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Stock Level:</span>
                  <span className="font-medium">
                    {selectedItem.minStock} {selectedItem.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost per Unit:</span>
                  <span className="font-medium">
                    ${selectedItem.costPerUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium">
                    $
                    {(selectedItem.quantity * selectedItem.costPerUnit).toFixed(
                      2
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{selectedItem.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(selectedItem.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      selectedItem.status
                    )}`}
                  >
                    <i
                      className={`${getStatusIcon(selectedItem.status)} mr-1`}
                    ></i>
                    {selectedItem.status.charAt(0).toUpperCase() +
                      selectedItem.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold"
                >
                  Edit Item
                </button>
                <button
                  type="button"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold"
                >
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pt-16 pb-6">
        {/* Summary Cards */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-xl p-2">
              <BusinessBanner
                bannerName=""
                bannerImageUrl="/images/banners/acme-hero.jpg"
                bannerDescription="Bespoke suits & alterations since 1998."
              />
            </div>
          </div>
        </div>

        {/* Materials Tab */}
        <div className="px-4">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-4 mb-4">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search materials, suppliers..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center"
                  aria-label="Search"
                >
                  <i className="ri-search-line text-gray-400 text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Materials List */}
          <div className="space-y-3">
            {filteredMaterials.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-600">{item.supplier}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>Price range</div>
                      <button
                        type="button"
                        onClick={() => handleViewDetails(item)}
                        className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-inbox-line text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
