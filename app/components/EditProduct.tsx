'use client'

import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FaPlusCircle, FaTimes } from 'react-icons/fa'
import { RxCrossCircled } from "react-icons/rx";
import { useCategoryStore } from "../stores/useCategoryStore";
import { IoIosArrowRoundDown } from "react-icons/io";
import { Product } from "../types/interfaces";
import { useProductStore } from "../stores/useProductStore";

interface EditProductProps {
  product: Product;
  onClose: () => void;
}

export default function EditProduct({ product , onClose }: EditProductProps) {
  const { categories, fetchCategories } = useCategoryStore();

  const [isOpen, setIsOpen] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false);
  const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [productName, setProductName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [categoryID, setCategoryID] = useState(product.categoryID || '');
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [totalStock, settotalStock] = useState(product.totalStock);
  const [images, setImages] = useState(product.images);
  const [videos, setVideos] = useState(product.videos);
  const [dimensions, setDimensions] = useState(product.dimensions);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);

  const resetForm = () => {
    setProductName(product.name);
    setBrand(product.brand);
    setCategoryID(product.categoryID || '');
    setPrice(product.price);
    setDescription(product.description);
    settotalStock(product.totalStock);
    setImages(product.images);
    setVideos(product.videos);
    setDimensions(product.dimensions);
    setNewImageUrl('');
    setNewVideoUrl('');
  };

  const closeEditProductModal = () => {
    if (productName.trim() !== product.name || brand.trim() !== product.brand || categoryID !== product.categoryID || price !== product.price || description.trim() !== product.description || totalStock !== product.totalStock || images !== product.images || videos !== product.videos || dimensions !== product.dimensions) {
      setIsCancelModalOpen(true);
    } else {
      setIsOpen(false);
      onClose();
    }
  };

  const confirmCloseModal = () => {
    setIsCancelModalOpen(false);
    setIsOpen(false);
    onClose();
  };

  const cancelCloseModal = () => {
    setIsCancelModalOpen(false);
  };

  const addImage = () => {
    const trimmedImageUrl = newImageUrl.trim();
    if (trimmedImageUrl && !images.includes(trimmedImageUrl)) {
      setImages([...images, trimmedImageUrl]);
      setNewImageUrl('');
    }
  };

  const addVideo = () => {
    const trimmedVideoUrl = newVideoUrl.trim();
    if (trimmedVideoUrl && !videos.includes(trimmedVideoUrl)) {
      setVideos([...videos, trimmedVideoUrl]);
      setNewVideoUrl('');
    }
  };

  const openDeleteImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsDeleteImageModalOpen(true);
  };

  const openDeleteVideoModal = (index: number) => {
    setSelectedVideoIndex(index);
    setIsDeleteVideoModalOpen(true);
  };

  const confirmDeleteImage = () => {
    if (selectedImageIndex !== null) {
      setImages(images.filter((_, i) => i !== selectedImageIndex));
    }
    setIsDeleteImageModalOpen(false);
    setSelectedImageIndex(null);
  };

  const confirmDeleteVideo = () => {
    if (selectedVideoIndex !== null) {
      setVideos(videos.filter((_, i) => i !== selectedVideoIndex));
    }
    setIsDeleteVideoModalOpen(false);
    setSelectedVideoIndex(null);
  };

  const cancelDeleteImage = () => {
    setIsDeleteImageModalOpen(false);
    setSelectedImageIndex(null);
  };

  const cancelDeleteVideo = () => {
    setIsDeleteVideoModalOpen(false);
    setSelectedVideoIndex(null);
  };

  const updateProduct = async () => {
    try {
      const productData = {
        name: productName.trim(),
        brand: brand.trim(),
        categoryID,
        price,
        description: description.trim(),
        totalStock,
        images,
        videos,
        inStock: totalStock > 0,
        ratings: product.ratings,
        dimensions: dimensions.trim(),
      };

      const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (response.ok) {
        useProductStore.getState().triggerRefresh()
        console.log("Product updated:", productData.name);
        setIsOpen(false);
        setIsConfirmModalOpen(false);
        onClose();
        resetForm();
      } else {
        console.error("Server error:", responseData);
        throw new Error(responseData.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={closeEditProductModal} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-[80vw] h-[80vh] overflow-y-auto">
            
            {/* Sticky Header */}
            <div className="sticky top-0 bg-slate-100 z-10 pb-2 rounded-md ">
              {/* Close (X) Button */}
              <button onClick={closeEditProductModal} className="absolute right-2 top-[2px] pt-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none">
                <RxCrossCircled className="w-6 h-6" />
              </button>

              <Dialog.Title className="text-lg font-semibold text-gray-900 text-center pt-2">
                Edit Product: {product.name}
              </Dialog.Title>
            </div>

            {/* First Row: Product Name, Brand, Category */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-900">Product Name</label>
                <div className="mt-2">
                  <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter product name" />
                </div>
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-900">Brand</label>
                <div className="mt-2">
                  <input id="brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter brand" />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-900">Category</label>
                <div className="mt-2 relative">
                  <select id="category" value={typeof categoryID === 'object' ? categoryID._id : categoryID} onChange={(e) => setCategoryID(e.target.value)} className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" >
                    <option value="">Select a category</option>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading categories...</option>
                    )}
                  </select>
                  <IoIosArrowRoundDown aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Second Row: Price, totalStock, Dimensions */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-900">Price</label>
                <div className="mt-2">
                  <input id="price" type="number" value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter price" min="0" />
                </div>
              </div>
              
              <div>
                <label htmlFor="totalStock" className="block text-sm font-medium text-gray-900">Stock</label>
                <div className="mt-2">
                  <input id="totalStock" type="number" value={totalStock} onChange={(e) => settotalStock(Math.max(0, Number(e.target.value)))} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter totalStock" min="0" />
                </div>
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-900">Dimensions (Optional)</label>
                <div className="mt-2">
                  <input id="dimensions" type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter dimensions"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded-lg resize-none focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" placeholder="Enter description" rows={2} />
            </div>

            {/* Images and Videos Inputs */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-900">Images</label>
                <div className="flex gap-2 mt-1">
                  <input id="imageUrl" type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="flex-1 p-2 border rounded-lg focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" placeholder="Enter image URL" />
                  <button onClick={addImage} disabled={!newImageUrl.trim()} className={`px-4 py-2 rounded-lg shadow ${!newImageUrl.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500'}`} >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-900">Videos (Optional)</label>
                <div className="flex gap-2 mt-1">
                  <input id="videoUrl" type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} className="flex-1 p-2 border rounded-lg focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" placeholder="Enter video URL" />
                  <button onClick={addVideo} disabled={!newVideoUrl.trim()} className={`px-4 py-2 rounded-lg shadow ${!newVideoUrl.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500'}`} >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Display Images and Videos */}
            <div className="mt-4 flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img src={image} alt={`Product Image ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button onClick={() => openDeleteImageModal(index)} className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1">
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {videos.map((video, index) => (
                <div key={index} className="relative w-32 h-32">
                  <video src={video} controls className="w-full h-full object-cover rounded-lg" />
                  <button onClick={() => openDeleteVideoModal(index)} className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1">
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Update Product Button */}
            <div className="mt-3 text-center">
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={!productName.trim() || !brand.trim() || !categoryID || price <= 0 || !description.trim() || totalStock <= 0 || images.length === 0}
                className={`px-24 py-2 text-white rounded-lg shadow ${
                  !productName.trim() || !brand.trim() || !categoryID || price <= 0 || !description.trim() || totalStock <= 0 || images.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      
      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="relative z-[100]">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Confirm Product Update
            </Dialog.Title>
            <p className="mb-4">Are you sure you want to update this product?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setIsConfirmModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={updateProduct} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Confirm</button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Image Confirmation Modal */}
      <Dialog open={isDeleteImageModalOpen} onClose={cancelDeleteImage} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
              Are you sure you want to delete this image?
            </Dialog.Title>
            <div className="mt-6 flex justify-around">
              <button onClick={confirmDeleteImage} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
              <button onClick={cancelDeleteImage} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Video Confirmation Modal */}
      <Dialog open={isDeleteVideoModalOpen} onClose={cancelDeleteVideo} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
              Are you sure you want to delete this video?
            </Dialog.Title>
            <div className="mt-6 flex justify-around">
              <button onClick={confirmDeleteVideo} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
              <button onClick={cancelDeleteVideo} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onClose={cancelCloseModal} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
              Are you sure you want to close?
            </Dialog.Title>
            <p className="text-center text-gray-600 mt-2">All your filled details will be lost.</p>
            <div className="mt-6 flex justify-around">
              <button onClick={confirmCloseModal} className="px-4 py-2 bg-red-600 text-white rounded-lg">Confirm</button>
              <button onClick={cancelCloseModal} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}







// // components/EditProduct.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { Dialog } from '@headlessui/react'
// import { FaTimes } from 'react-icons/fa'
// import { RxCrossCircled } from "react-icons/rx"
// import { useProductStore } from "../stores/useProductStore"
// import { useCategoryStore } from "../stores/useCategoryStore"
// import { Product } from "../types/interfaces"
// import { Switch } from '@headlessui/react'

// interface EditProductProps {
//   product: Product;
//   onClose: () => void;
// }

// export default function EditProduct({ product, onClose }: EditProductProps) {
//   const [isOpen, setIsOpen] = useState(true)
//   const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false)
//   const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false)
//   const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
//   const [hasChanges, setHasChanges] = useState(false)
//   const [isUpdateConfirmModalOpen, setIsUpdateConfirmModalOpen] = useState(false)
//   const [isFinalConfirmModalOpen, setIsFinalConfirmModalOpen] = useState(false)
  
//   // Product state
//   const [productName, setProductName] = useState(product.name)
//   const [brand, setBrand] = useState(product.brand)
//   const [categoryID, setCategoryID] = useState(product.categoryID)
//   const [price, setPrice] = useState(product.price)
//   const [totalStock, setTotalStock] = useState(product.totalStock)
//   const [description, setDescription] = useState(product.description)
//   const [images, setImages] = useState<string[]>(product.images)
//   const [videos, setVideos] = useState<string[]>(product.videos)
//   const [dimensions, setDimensions] = useState(product.dimensions)
//   const [newImageUrl, setNewImageUrl] = useState('')
//   const [newVideoUrl, setNewVideoUrl] = useState('')
//   const [inStock, setInStock] = useState(product.inStock)

//   const { categories } = useCategoryStore()

//   useEffect(() => {
//     const originalState = {
//       ...product,
//       categoryID: product.categoryID,
//       dimensions: product.dimensions || ''
//     }
    
//     const currentState = {
//       name: productName,
//       brand,
//       categoryID,
//       price,
//       totalStock,
//       description,
//       images,
//       videos,
//       dimensions,
//       inStock
//     }

//     setHasChanges(JSON.stringify(originalState) !== JSON.stringify(currentState))
//   }, [productName, brand, categoryID, price, totalStock, description, images, videos, dimensions, inStock])

//   useEffect(() => {
//     setInStock(totalStock > 0)
//   }, [totalStock])

//   const resetForm = () => {
//     setProductName(product.name)
//     setBrand(product.brand)
//     setCategoryID(product.categoryID)
//     setPrice(product.price)
//     setTotalStock(product.totalStock)
//     setDescription(product.description)
//     setImages(product.images)
//     setVideos(product.videos)
//     setDimensions(product.dimensions)
//     setNewImageUrl('')
//     setNewVideoUrl('')
//   }

//   const closeEditModal = () => {
//     if (hasChanges) {
//       setIsCancelModalOpen(true)
//     } else {
//       handleClose()
//     }
//   }

//   const handleClose = () => {
//     setIsOpen(false)
//     setIsCancelModalOpen(false)
//     resetForm()
//     onClose()
//   }

//   const addImage = () => {
//     const trimmedUrl = newImageUrl.trim()
//     if (trimmedUrl && !images.includes(trimmedUrl)) {
//       setImages([...images, trimmedUrl])
//       setNewImageUrl('')
//     }
//   }

//   const addVideo = () => {
//     const trimmedUrl = newVideoUrl.trim()
//     if (trimmedUrl && !videos.includes(trimmedUrl)) {
//       setVideos([...videos, trimmedUrl])
//       setNewVideoUrl('')
//     }
//   }

//   const handleUpdateConfirmation = () => {
//     setIsUpdateConfirmModalOpen(true)
//   }

//   const handleFinalConfirmation = () => {
//     setIsUpdateConfirmModalOpen(false)
//     setIsFinalConfirmModalOpen(true)
//   }

//   const confirmUpdate = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: productName.trim(),
//           brand: brand.trim(),
//           categoryID,
//           price,
//           totalStock,
//           description: description.trim(),
//           images,
//           videos,
//           dimensions: dimensions.trim(),
//           inStock
//         })
//       })

//       if (response.ok) {
//         useProductStore.getState().triggerRefresh()
//         handleClose()
//       } else {
//         throw new Error('Failed to update product')
//       }
//     } catch (error) {
//       console.error(error)
//       alert('Error updating product')
//     } finally {
//       setIsFinalConfirmModalOpen(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onClose={closeEditModal} className="relative z-50">
//       <div className="fixed inset-0 bg-gray-500/75" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
//           <button onClick={closeEditModal} className="absolute right-3 top-3">
//             <RxCrossCircled className="w-6 h-6 text-gray-600 hover:text-gray-800" />
//           </button>

//           <Dialog.Title className="text-lg font-semibold text-gray-900 text-center mb-4">
//             Edit Product: {product.name}
//           </Dialog.Title>

//           <div className="grid grid-cols-2 gap-4">
//             {/* Left Column */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Product Name</label>
//                 <input
//                   value={productName}
//                   onChange={(e) => setProductName(e.target.value)}
//                   className="w-full mt-1 p-2 border rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Brand</label>
//                 <input
//                   value={brand}
//                   onChange={(e) => setBrand(e.target.value)}
//                   className="w-full mt-1 p-2 border rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Category</label>
//                 <select
//                   value={categoryID}
//                   onChange={(e) => setCategoryID(e.target.value)}
//                   className="w-full mt-1 p-2 border rounded-lg bg-white"
//                 >
//                   {categories.map(cat => (
//                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Price</label>
//                 <input
//                   type="number"
//                   value={price}
//                   onChange={(e) => setPrice(Number(e.target.value))}
//                   className="w-full mt-1 p-2 border rounded-lg"
//                 />
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Stock</label>
//                 <input
//                   type="number"
//                   value={totalStock}
//                   onChange={(e) => setTotalStock(Number(e.target.value))}
//                   className="w-full mt-1 p-2 border rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Dimensions (Optional)</label>
//                 <input
//                   value={dimensions}
//                   onChange={(e) => setDimensions(e.target.value)}
//                   className="w-full mt-1 p-2 border rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">In Stock Status</label>
//                 <div className="mt-2 flex items-center gap-2">
//                   <span className={`px-2 py-1 rounded-full text-sm ${
//                     inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                   }`}>
//                     {inStock ? 'In Stock' : 'Out of Stock'}
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="w-full mt-1 p-2 border rounded-lg h-32"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Media Management */}
//           <div className="mt-6 grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Images</label>
//               <div className="flex gap-2 mt-1">
//                 <input
//                   type="text"
//                   value={newImageUrl}
//                   onChange={(e) => setNewImageUrl(e.target.value)}
//                   className="flex-1 p-2 border rounded-lg"
//                   placeholder="Add image URL"
//                 />
//                 <button
//                   onClick={addImage}
//                   disabled={!newImageUrl.trim()}
//                   className={`px-4 py-2 rounded-lg ${
//                     !newImageUrl.trim() ? 'bg-gray-400' : 'bg-blue-600 text-white'
//                   }`}
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {images.map((img, index) => (
//                   <div key={index} className="relative">
//                     <img src={img} alt={`Product ${index}`} className="w-16 h-16 object-cover rounded" />
//                     <button
//                       onClick={() => {
//                         setSelectedMediaIndex(index)
//                         setIsDeleteImageModalOpen(true)
//                       }}
//                       className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
//                     >
//                       <FaTimes className="w-4 h-4 text-white" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Videos (Optional)</label>
//               <div className="flex gap-2 mt-1">
//                 <input
//                   type="text"
//                   value={newVideoUrl}
//                   onChange={(e) => setNewVideoUrl(e.target.value)}
//                   className="flex-1 p-2 border rounded-lg"
//                   placeholder="Add video URL"
//                 />
//                 <button
//                   onClick={addVideo}
//                   disabled={!newVideoUrl.trim()}
//                   className={`px-4 py-2 rounded-lg ${
//                     !newVideoUrl.trim() ? 'bg-gray-400' : 'bg-blue-600 text-white'
//                   }`}
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {videos.map((video, index) => (
//                   <div key={index} className="relative">
//                     <video controls className="w-16 h-16 object-cover rounded">
//                       <source src={video} type="video/mp4" />
//                     </video>
//                     <button
//                       onClick={() => {
//                         setSelectedMediaIndex(index)
//                         setIsDeleteVideoModalOpen(true)
//                       }}
//                       className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
//                     >
//                       <FaTimes className="w-4 h-4 text-white" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 text-center">
//             <button
//               onClick={handleUpdateConfirmation}
//               disabled={!productName.trim() || !brand.trim() || !categoryID || price <= 0 || totalStock < 0}
//               className={`px-6 py-2 text-white rounded-lg ${
//                 !productName.trim() || !brand.trim() || !categoryID || price <= 0 || totalStock < 0
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-indigo-600 hover:bg-indigo-500'
//               }`}
//             >
//               Update Product
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Delete Image Modal */}
//       <Dialog open={isDeleteImageModalOpen} onClose={() => setIsDeleteImageModalOpen(false)} className="relative z-[100]">
//         {/* Same structure as EditCategory's delete modal */}
//       </Dialog>

//       {/* Delete Video Modal */}
//       <Dialog open={isDeleteVideoModalOpen} onClose={() => setIsDeleteVideoModalOpen(false)} className="relative z-[100]">
//         {/* Same structure as EditCategory's delete modal */}
//       </Dialog>

//       {/* Cancel Confirmation Modal */}
//       <Dialog open={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} className="relative z-[100]">
//         {/* Same structure as EditCategory's cancel modal */}
//       </Dialog>

//       {/* Update Confirmation Modal */}
//       <Dialog open={isUpdateConfirmModalOpen} onClose={() => setIsUpdateConfirmModalOpen(false)} className="relative z-[100]">
//         {/* Same structure as EditCategory's update confirmation modal */}
//       </Dialog>

//       {/* Final Confirmation Modal */}
//       <Dialog open={isFinalConfirmModalOpen} onClose={() => setIsFinalConfirmModalOpen(false)} className="relative z-[110]">
//         {/* Same structure as EditCategory's final confirmation modal */}
//       </Dialog>
//     </Dialog>
//   )
// }