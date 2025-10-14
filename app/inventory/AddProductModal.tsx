import { RefObject, useEffect, useState } from "react";
import type { FabricType, NewProduct, Product } from "./page";
import apiClient from "@/lib/api";

interface AddProductModalProps {
  show: boolean;
  onClose: () => void;
  setShowAddProductModal: (show: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  fetchProducts: () => void;
  mode?: "add" | "edit";
  selectedProduct?: Product | null;
}

export default function AddProductModal({
  show,
  onClose,
  fileInputRef,
  setShowAddProductModal,
  fetchProducts,
  mode = "add",
  selectedProduct = null,
}: AddProductModalProps) {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    description: "",
    images: [],
    fabricTypes: [],
    availableColors: [],
    availableDesigns: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [newFabricType, setNewFabricType] = useState("");
  const [newFabricCost, setNewFabricCost] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newDesign, setNewDesign] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleAddProduct = () => {
    newProduct.images.forEach(
      (url) => url.startsWith("blob:") && URL.revokeObjectURL(url)
    );
    setNewProduct({
      name: "",
      description: "",
      images: [],
      fabricTypes: [],
      availableColors: [],
      availableDesigns: [],
    });
    setImageFiles([]);
    setNewFabricType("");
    setNewFabricCost("");
    setNewColor("");
    setNewDesign("");
    setSelectedImageIndex(0);
  };

  useEffect(() => {
    if (mode === "add") {
      handleAddProduct();
    } else if (mode === "edit" && selectedProduct) {
      setNewProduct({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        images: selectedProduct?.documents?.map(({ url }) => url) || [],
        fabricTypes: selectedProduct.options.fabricTypes || [],
        availableColors: selectedProduct.options.availableColors || [],
        availableDesigns: selectedProduct.options.availableDesigns || [],
      });
      setImageFiles([]);
      setNewFabricType("");
      setNewFabricCost("");
      setNewColor("");
      setNewDesign("");
      setSelectedImageIndex(0);
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      newProduct.images.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [newProduct.images]);

  const handleSaveProduct = async () => {
    const productPayload = {
      ...newProduct,
      configuration: {
        color: newProduct.availableColors,
        design: newProduct.availableDesigns,
        fabric: newProduct.fabricTypes,
      },
    };

    const formData = new FormData();
    formData.append("product", JSON.stringify(productPayload));
    imageFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    try {
      if (mode === "edit" && selectedProduct?.id) {
        // For now, update only textual fields (name, description, options).
        // If image updates are required for edit, backend must accept multipart PUT.
        await apiClient.products.update(selectedProduct.id, {
          name: newProduct.name,
          description: newProduct.description,
          options: {
            availableColors: newProduct.availableColors,
            availableDesigns: newProduct.availableDesigns,
            fabricTypes: newProduct.fabricTypes,
          },
        });
      } else {
        await apiClient.products.create(formData);
      }
      setImageFiles([]);
      setShowAddProductModal(false);
      fetchProducts();
    } catch (e) {
      console.error("Failed to save product:", e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = Math.max(0, 6 - newProduct.images.length);
    if (remainingSlots === 0) return;

    const incoming = Array.from(files).slice(0, remainingSlots);
    const urls = incoming.map((f) => URL.createObjectURL(f));

    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));
    setImageFiles((prev) => [...prev, ...incoming]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setNewProduct((prev) => {
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

    setNewProduct((prev) => {
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
    setNewProduct((prev) => ({
      ...prev,
      fabricTypes: prev.fabricTypes.filter(
        (type) => type.name.toLowerCase() !== fabricName.toLowerCase()
      ),
    }));
  };

  const addColor = () => {
    const v = newColor.trim();
    if (!v) return;
    setNewProduct((prev) => {
      if (prev.availableColors.some((c) => c.toLowerCase() === v.toLowerCase()))
        return prev;
      return { ...prev, availableColors: [...prev.availableColors, v] };
    });
    setNewColor("");
  };

  const removeColor = (color: string) => {
    setNewProduct((prev) => ({
      ...prev,
      availableColors: prev.availableColors.filter(
        (c) => c.toLowerCase() !== color.toLowerCase()
      ),
    }));
  };

  const addDesign = () => {
    const v = newDesign.trim();
    if (!v) return;
    setNewProduct((prev) => {
      if (
        prev.availableDesigns.some((d) => d.toLowerCase() === v.toLowerCase())
      )
        return prev;
      return { ...prev, availableDesigns: [...prev.availableDesigns, v] };
    });
    setNewDesign("");
  };

  const removeDesign = (d: string) =>
    setNewProduct((prev) => ({
      ...prev,
      availableDesigns: prev.availableDesigns.filter(
        (x) => x.toLowerCase() !== d.toLowerCase()
      ),
    }));

  if (!show) return null;

  return (
    <div className="mb-20 fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{mode === "edit" ? "Edit Product" : "Add New Product"}</h3>
            <button
              onClick={onClose}
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
                Product Photos ({newProduct.images.length}/6)
              </label>

              {newProduct.images.length > 0 && (
                <div className="mb-3">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={newProduct.images[selectedImageIndex]}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex space-x-2 overflow-x-auto">
                    {newProduct.images.map((image, index) => (
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

              {newProduct.images.length < 6 && (
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
                Product Name
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
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
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-y"
                placeholder="e.g., Fabric details, color, notes, special instructions…"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fabric Types ({newProduct.fabricTypes.length})
              </label>

              {newProduct.fabricTypes.length > 0 && (
                <div className="space-y-2 mb-3">
                  {newProduct.fabricTypes.map((fabricType, index) => (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors ({newProduct.availableColors.length})
              </label>

              {newProduct.availableColors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {newProduct.availableColors.map((color, index) => (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Designs ({newProduct.availableDesigns.length})
              </label>

              {newProduct.availableDesigns.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {newProduct.availableDesigns.map((design, index) => (
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
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProduct}
              disabled={!newProduct.name.trim()}
              className={`flex-1 py-3 rounded-xl font-semibold ${
                newProduct.name.trim()
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {mode === "edit" ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
