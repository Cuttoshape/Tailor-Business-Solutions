import type { Product } from "./page";

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "in stock":
      return "border-green-500 text-green-500";
    case "low stock":
      return "border-yellow-500 text-yellow-500";
    case "out of stock":
      return "border-red-500 text-red-500";
    default:
      return "border-gray-500 text-gray-500";
  }
};

const getStatusIcon = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "in stock":
      return "ri-checkbox-circle-line";
    case "low stock":
      return "ri-error-warning-line";
    case "out of stock":
      return "ri-close-circle-line";
    default:
      return "ri-information-line";
  }
};

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
}: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Product Details</h3>
            <button
              onClick={onClose}
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
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-semibold">{product.name}</h4>
            <p className="text-sm text-gray-600">
              {product.options.availableColors?.join(", ") || "N/A"}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium capitalize">
                {product.category || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier:</span>
              <span className="font-medium">{product.supplier || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Stock:</span>
              <span className="font-medium">
                {product.quantity !== undefined ? product.quantity : "N/A"}{" "}
                {product.quantity ? "yards" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Min Stock Level:</span>
              <span className="font-medium">
                {product.minStock !== undefined ? product.minStock : "N/A"}{" "}
                {product.minStock ? "yards" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cost per Unit:</span>
              <span className="font-medium">
                {product.costPerUnit !== undefined
                  ? `$${product.costPerUnit.toFixed(2)}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Value:</span>
              <span className="font-medium">
                {product.quantity !== undefined &&
                product.costPerUnit !== undefined
                  ? `$${(product.quantity * product.costPerUnit).toFixed(2)}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{product.location || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">
                {product.updatedAt
                  ? new Date(product.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  product.status
                )}`}
              >
                <i className={`${getStatusIcon(product.status)} mr-1`}></i>
                {product.status
                  ? product.status.charAt(0).toUpperCase() +
                    product.status.slice(1)
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold"
            >
              Edit Product
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
  );
}
