import type { Product } from "./page";

interface MaterialsListProps {
  products: Product[];
  handleViewDetails: (item: Product) => void;
  handleEditProduct: (item: Product) => void;
  handleDeleteProduct?: (item: Product) => void;
}

export default function MaterialsList({
  products,
  handleViewDetails,
  handleEditProduct,
  handleDeleteProduct,
}: MaterialsListProps) {
  return (
    <div className="space-y-3">
      {products.map((item) => (
        <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.imageUrl || "/placeholder.jpg"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-600">
                    {item.description || "No description"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  ${item?.lowPrice} - ${item?.highPrice}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewDetails(item)}
                    className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg text-xs font-medium"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditProduct(item)}
                    className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg text-xs font-medium"
                  >
                    Edit
                  </button>
                  {handleDeleteProduct && (
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => handleDeleteProduct(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600"
                    >
                      <i className="ri-delete-bin-6-line" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-inbox-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No items found
          </h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
