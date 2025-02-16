// components/EditProduct.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { RxCrossCircled } from "react-icons/rx"
import { useProductStore } from "../stores/useProductStore"
import { useCategoryStore } from "../stores/useCategoryStore"
import { Product } from "../types/interfaces"
import { Switch } from '@headlessui/react'

interface EditProductProps {
  product: Product;
  onClose: () => void;
}

export default function EditProduct({ product, onClose }: EditProductProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false)
  const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isUpdateConfirmModalOpen, setIsUpdateConfirmModalOpen] = useState(false)
  const [isFinalConfirmModalOpen, setIsFinalConfirmModalOpen] = useState(false)
  
  // Product state
  const [productName, setProductName] = useState(product.name)
  const [brand, setBrand] = useState(product.brand)
  const [categoryID, setCategoryID] = useState(product.categoryID)
  const [price, setPrice] = useState(product.price)
  const [totalStock, setTotalStock] = useState(product.totalStock)
  const [description, setDescription] = useState(product.description)
  const [images, setImages] = useState<string[]>(product.images)
  const [videos, setVideos] = useState<string[]>(product.videos)
  const [dimensions, setDimensions] = useState(product.dimensions)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [inStock, setInStock] = useState(product.inStock)

  const { categories } = useCategoryStore()

  useEffect(() => {
    const originalState = {
      ...product,
      categoryID: product.categoryID,
      dimensions: product.dimensions || ''
    }
    
    const currentState = {
      name: productName,
      brand,
      categoryID,
      price,
      totalStock,
      description,
      images,
      videos,
      dimensions,
      inStock
    }

    setHasChanges(JSON.stringify(originalState) !== JSON.stringify(currentState))
  }, [productName, brand, categoryID, price, totalStock, description, images, videos, dimensions, inStock])

  useEffect(() => {
    setInStock(totalStock > 0)
  }, [totalStock])

  const resetForm = () => {
    setProductName(product.name)
    setBrand(product.brand)
    setCategoryID(product.categoryID)
    setPrice(product.price)
    setTotalStock(product.totalStock)
    setDescription(product.description)
    setImages(product.images)
    setVideos(product.videos)
    setDimensions(product.dimensions)
    setNewImageUrl('')
    setNewVideoUrl('')
  }

  const closeEditModal = () => {
    if (hasChanges) {
      setIsCancelModalOpen(true)
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsCancelModalOpen(false)
    resetForm()
    onClose()
  }

  const addImage = () => {
    const trimmedUrl = newImageUrl.trim()
    if (trimmedUrl && !images.includes(trimmedUrl)) {
      setImages([...images, trimmedUrl])
      setNewImageUrl('')
    }
  }

  const addVideo = () => {
    const trimmedUrl = newVideoUrl.trim()
    if (trimmedUrl && !videos.includes(trimmedUrl)) {
      setVideos([...videos, trimmedUrl])
      setNewVideoUrl('')
    }
  }

  const handleUpdateConfirmation = () => {
    setIsUpdateConfirmModalOpen(true)
  }

  const handleFinalConfirmation = () => {
    setIsUpdateConfirmModalOpen(false)
    setIsFinalConfirmModalOpen(true)
  }

  const confirmUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName.trim(),
          brand: brand.trim(),
          categoryID,
          price,
          totalStock,
          description: description.trim(),
          images,
          videos,
          dimensions: dimensions.trim(),
          inStock
        })
      })

      if (response.ok) {
        useProductStore.getState().triggerRefresh()
        handleClose()
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error(error)
      alert('Error updating product')
    } finally {
      setIsFinalConfirmModalOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={closeEditModal} className="relative z-50">
      <div className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <button onClick={closeEditModal} className="absolute right-3 top-3">
            <RxCrossCircled className="w-6 h-6 text-gray-600 hover:text-gray-800" />
          </button>

          <Dialog.Title className="text-lg font-semibold text-gray-900 text-center mb-4">
            Edit Product: {product.name}
          </Dialog.Title>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={categoryID}
                  onChange={(e) => setCategoryID(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  value={totalStock}
                  onChange={(e) => setTotalStock(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Dimensions (Optional)</label>
                <input
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">In Stock Status</label>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg h-32"
                />
              </div>
            </div>
          </div>

          {/* Media Management */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Add image URL"
                />
                <button
                  onClick={addImage}
                  disabled={!newImageUrl.trim()}
                  className={`px-4 py-2 rounded-lg ${
                    !newImageUrl.trim() ? 'bg-gray-400' : 'bg-blue-600 text-white'
                  }`}
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt={`Product ${index}`} className="w-16 h-16 object-cover rounded" />
                    <button
                      onClick={() => {
                        setSelectedMediaIndex(index)
                        setIsDeleteImageModalOpen(true)
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <FaTimes className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Videos (Optional)</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Add video URL"
                />
                <button
                  onClick={addVideo}
                  disabled={!newVideoUrl.trim()}
                  className={`px-4 py-2 rounded-lg ${
                    !newVideoUrl.trim() ? 'bg-gray-400' : 'bg-blue-600 text-white'
                  }`}
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {videos.map((video, index) => (
                  <div key={index} className="relative">
                    <video controls className="w-16 h-16 object-cover rounded">
                      <source src={video} type="video/mp4" />
                    </video>
                    <button
                      onClick={() => {
                        setSelectedMediaIndex(index)
                        setIsDeleteVideoModalOpen(true)
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <FaTimes className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleUpdateConfirmation}
              disabled={!productName.trim() || !brand.trim() || !categoryID || price <= 0 || totalStock < 0}
              className={`px-6 py-2 text-white rounded-lg ${
                !productName.trim() || !brand.trim() || !categoryID || price <= 0 || totalStock < 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              Update Product
            </button>
          </div>
        </div>
      </div>

      {/* Delete Image Modal */}
      <Dialog open={isDeleteImageModalOpen} onClose={() => setIsDeleteImageModalOpen(false)} className="relative z-[100]">
        {/* Same structure as EditCategory's delete modal */}
      </Dialog>

      {/* Delete Video Modal */}
      <Dialog open={isDeleteVideoModalOpen} onClose={() => setIsDeleteVideoModalOpen(false)} className="relative z-[100]">
        {/* Same structure as EditCategory's delete modal */}
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} className="relative z-[100]">
        {/* Same structure as EditCategory's cancel modal */}
      </Dialog>

      {/* Update Confirmation Modal */}
      <Dialog open={isUpdateConfirmModalOpen} onClose={() => setIsUpdateConfirmModalOpen(false)} className="relative z-[100]">
        {/* Same structure as EditCategory's update confirmation modal */}
      </Dialog>

      {/* Final Confirmation Modal */}
      <Dialog open={isFinalConfirmModalOpen} onClose={() => setIsFinalConfirmModalOpen(false)} className="relative z-[110]">
        {/* Same structure as EditCategory's final confirmation modal */}
      </Dialog>
    </Dialog>
  )
}