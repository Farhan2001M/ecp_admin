// CreateProduct Component
'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FaPlusCircle, FaTimes } from 'react-icons/fa'
import { RxCrossCircled } from "react-icons/rx";
import { useCategoryStore } from "../stores/useCategoryStore";
import { Product } from '../types/interfaces'; // Import the Product interface

export default function CreateProduct() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false)
  const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
  const [productName, setProductName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [description, setDescription] = useState('')
  const [sku, setSku] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [dimensions, setDimensions] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')

  const resetForm = () => {
    setProductName('')
    setBrand('')
    setCategory('')
    setPrice(0)
    setDescription('')
    setSku('')
    setImages([])
    setVideos([])
    setDimensions('')
    setNewImageUrl('')
    setNewVideoUrl('')
  }

  const closeCreateProductModal = () => {
    if (productName.trim() || brand.trim() || category || price > 0 || description.trim() || sku.trim() || images.length > 0) {
      setIsCancelModalOpen(true)
    } else {
      setIsOpen(false)
      resetForm()
    }
  }

  const confirmCloseModal = () => {
    setIsCancelModalOpen(false)
    setIsOpen(false)
    resetForm()
  }

  const cancelCloseModal = () => {
    setIsCancelModalOpen(false)
  }

  const addImage = () => {
    const trimmedImageUrl = newImageUrl.trim()
    if (trimmedImageUrl && !images.includes(trimmedImageUrl)) {
      setImages([...images, trimmedImageUrl])
      setNewImageUrl('')
    }
  }

  const addVideo = () => {
    const trimmedVideoUrl = newVideoUrl.trim()
    if (trimmedVideoUrl && !videos.includes(trimmedVideoUrl)) {
      setVideos([...videos, trimmedVideoUrl])
      setNewVideoUrl('')
    }
  }

  const openDeleteImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setIsDeleteImageModalOpen(true)
  }

  const openDeleteVideoModal = (index: number) => {
    setSelectedVideoIndex(index)
    setIsDeleteVideoModalOpen(true)
  }

  const confirmDeleteImage = () => {
    if (selectedImageIndex !== null) {
      setImages(images.filter((_, i) => i !== selectedImageIndex))
    }
    setIsDeleteImageModalOpen(false)
    setSelectedImageIndex(null)
  }

  const confirmDeleteVideo = () => {
    if (selectedVideoIndex !== null) {
      setVideos(videos.filter((_, i) => i !== selectedVideoIndex))
    }
    setIsDeleteVideoModalOpen(false)
    setSelectedVideoIndex(null)
  }

  const cancelDeleteImage = () => {
    setIsDeleteImageModalOpen(false)
    setSelectedImageIndex(null)
  }

  const cancelDeleteVideo = () => {
    setIsDeleteVideoModalOpen(false)
    setSelectedVideoIndex(null)
  }

  const createProduct = async () => {
    try {
      const productData: Omit<Product, '_id'> = {
        name: productName.trim(),
        brand: brand.trim(),
        category,
        price,
        description: description.trim(),
        sku: sku.trim(),
        images,
        videos,
        inStock: true,
        ratings: 0,
        dimensions: dimensions.trim(),
      }

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        console.log('Product created:', productData.name)
        setIsOpen(false)
        setIsConfirmModalOpen(false)
        resetForm()
      } else {
        throw new Error('Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  return (
    <div className="">
      <button onClick={() => setIsOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 flex items-center gap-2">
        <FaPlusCircle />
        ADD Product
      </button>

      {/* Modal for product creation */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-[80vw] h-[80vh] overflow-y-auto">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white z-10 pb-4">
              <button onClick={closeCreateProductModal} className="absolute right-3 top-3 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none">
                <RxCrossCircled className="w-6 h-6" />
              </button>
              <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
                Create Your New Product
              </Dialog.Title>
            </div>

            {/* First Row: Product Name, Brand, Category */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter brand" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 p-2 border rounded-lg">
                  <option value="">Select a category</option>
                  {/* Populate categories from your store or API */}
                </select>
              </div>
            </div>

            {/* Second Row: Price, SKU, Dimensions */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter price" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter SKU" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dimensions (Optional)</label>
                <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter dimensions" />
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter description" rows={4} />
            </div>

            {/* Images and Videos Inputs */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="Enter image URL" />
                  <button onClick={addImage} disabled={!newImageUrl.trim()} className={`px-4 py-2 rounded-lg shadow ${!newImageUrl.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500'}`}>
                    Add
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Videos (Optional)</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="Enter video URL" />
                  <button onClick={addVideo} disabled={!newVideoUrl.trim()} className={`px-4 py-2 rounded-lg shadow ${!newVideoUrl.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500'}`}>
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

            {/* Create Product Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={!productName.trim() || !brand.trim() || !category || price <= 0 || !description.trim() || !sku.trim() || images.length === 0}
                className={`px-4 py-2 text-white rounded-lg shadow ${
                  !productName.trim() || !brand.trim() || !category || price <= 0 || !description.trim() || !sku.trim() || images.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                Create Product
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
              Confirm Product Creation
            </Dialog.Title>
            <p className="mb-4">Are you sure you want to create this product?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setIsConfirmModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={createProduct} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Confirm</button>
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
  )
}

// // CreateProduct Component
// 'use client'

// import { useState } from 'react'
// import { Dialog } from '@headlessui/react'
// import { FaPlusCircle, FaTimes } from 'react-icons/fa'
// import { RxCrossCircled } from "react-icons/rx";
// import { useCategoryStore } from "../stores/useCategoryStore";
// import { Product } from '../types/interfaces'; // Import the Product interface

// export default function CreateProduct() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
//   const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false)
//   const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
//   const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
//   const [productName, setProductName] = useState('')
//   const [brand, setBrand] = useState('')
//   const [category, setCategory] = useState('')
//   const [price, setPrice] = useState<number>(0)
//   const [description, setDescription] = useState('')
//   const [sku, setSku] = useState('')
//   const [images, setImages] = useState<string[]>([])
//   const [videos, setVideos] = useState<string[]>([])
//   const [dimensions, setDimensions] = useState('')
//   const [newImageUrl, setNewImageUrl] = useState('')
//   const [newVideoUrl, setNewVideoUrl] = useState('')

//   const resetForm = () => { setProductName('') , setBrand('') , setCategory('') , setPrice(0) , setDescription('') , setSku('') , setImages([]) , setVideos([]) , setDimensions('') , setNewImageUrl('') , setNewVideoUrl('') }

//   const closeCreateProductModal = () => {
//     if (productName.trim() || brand.trim() || category || price > 0 || description.trim() || sku.trim() || images.length > 0 || videos.length > 0 || dimensions.trim()) {
//       setIsCancelModalOpen(true)
//     } else {
//       setIsOpen(false)
//       resetForm()
//     }
//   }

//   const confirmCloseModal = () => { setIsCancelModalOpen(false) ,setIsOpen(false) ,resetForm() }

//   const cancelCloseModal = () => {
//     setIsCancelModalOpen(false)
//   }

//   const addImage = () => {
//     const trimmedImageUrl = newImageUrl.trim()
//     if (trimmedImageUrl && !images.includes(trimmedImageUrl)) {
//       setImages([...images, trimmedImageUrl])
//       setNewImageUrl('')
//     }
//   }

//   const addVideo = () => {
//     const trimmedVideoUrl = newVideoUrl.trim()
//     if (trimmedVideoUrl && !videos.includes(trimmedVideoUrl)) {
//       setVideos([...videos, trimmedVideoUrl])
//       setNewVideoUrl('')
//     }
//   }

//   const openDeleteImageModal = (index: number) => {
//     setSelectedImageIndex(index)
//     setIsDeleteImageModalOpen(true)
//   }

//   const openDeleteVideoModal = (index: number) => {
//     setSelectedVideoIndex(index);
//     setIsDeleteImageModalOpen(true); // Reuse the same modal for simplicity
//   };

//   const confirmDeleteImage = () => {
//     if (selectedImageIndex !== null) {
//       setImages(images.filter((_, i) => i !== selectedImageIndex));
//     } else if (selectedVideoIndex !== null) {
//       setVideos(videos.filter((_, i) => i !== selectedVideoIndex));
//     }
//     setIsDeleteImageModalOpen(false);
//     setSelectedImageIndex(null);
//     setSelectedVideoIndex(null);
//   };

//   const cancelDeleteImage = () => {
//     setIsDeleteImageModalOpen(false)
//     setSelectedImageIndex(null)
//   }

//   const createProduct = async () => {
//     try {
//       const productData: Omit<Product, '_id'> = {
//         name: productName.trim(),
//         brand: brand.trim(),
//         category,
//         price,
//         description: description.trim(),
//         sku: sku.trim(),
//         images,
//         videos,
//         inStock: true,
//         ratings: 0,
//         dimensions: dimensions.trim(),
//       }

//       const response = await fetch('http://localhost:5000/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(productData),
//       })

//       if (response.ok) {
//         console.log('Product created:', productData.name)
//         setIsOpen(false)
//         setIsConfirmModalOpen(false)
//         resetForm()
//       } else {
//         throw new Error('Failed to create product')
//       }
//     } catch (error) {
//       console.error('Error creating product:', error)
//     }
//   }

//   return (
//     <div className="">
//       <button onClick={() => setIsOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 flex items-center gap-2">
//         <FaPlusCircle />
//         ADD Product
//       </button>

//       {/* Modal for product creation */}
//       <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-10">
//         <div className="fixed inset-0 bg-gray-500/75" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <div className="relative bg-white rounded-lg shadow-xl p-6 w-[80vw] h-[80vh] overflow-y-auto">
            
//             <div className="sticky top-0 bg-slate-100 z-10 pb-2 rounded-md ">
//               {/* Close (X) Button */}
//               <button onClick={closeCreateProductModal} className="absolute right-2 top-[2px] pt-2 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none">
//                 <RxCrossCircled className="w-6 h-6" />
//               </button>

//               <Dialog.Title className="text-lg font-semibold text-gray-900 text-center pt-2">
//                 Create Your New Product
//               </Dialog.Title>
//             </div>
            
//             {/* First Row: Product Name, Brand, Category */}
//             <div className="mt-4 grid grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Product Name</label>
//                 <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter product name" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Brand</label>
//                 <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter brand" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Category</label>
//                 <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 p-2 border rounded-lg">
//                   <option value="">Select a category</option>
//                   {/* Populate categories from your store or API */}
//                 </select>
//               </div>
//             </div>

//             {/* Second Row: Price, SKU, Dimensions */}
//             <div className="mt-4 grid grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Price</label>
//                 <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter price" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">SKU</label>
//                 <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter SKU" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Dimensions (Optional)</label>
//                 <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter dimensions" />
//               </div>
//             </div>

//             {/* Description */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700">Description</label>
//               <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" placeholder="Enter description" rows={2} />
//             </div>

//             {/* Images And Videoes Section Section */}
//             <div className="mt-4 grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Images</label>
//                 <div className="flex gap-2 mt-1">
//                   <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="Enter image URL" />
//                   <button onClick={addImage} disabled={!newImageUrl.trim()} className={`px-4 py-2 rounded-lg shadow ${!newImageUrl.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500'}`}>
//                     Add
//                   </button>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Videos (Optional)</label>
//                 <div className="flex gap-2 mt-1">
//                   <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="Enter video URL" />
//                   <button onClick={addVideo} disabled={!newVideoUrl.trim()} className={`px-4 py-2 rounded-lg shadow ${!newVideoUrl.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500'}`}>
//                     Add
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className='flex gap-2'>
//               {/* Display Images */}
//               <div className="mt-4">
//                 <div className="mt-3 grid grid-cols-3 gap-4">
//                   {images.map((image, index) => (
//                     <div key={index} className="relative">
//                       <img src={image} alt={`Product Image ${index + 1}`} className="w-full h-auto rounded-lg" />
//                       <button onClick={() => openDeleteImageModal(index)} className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1">
//                         <FaTimes className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Display Videos */}
//               <div className="mt-4">
//                 <div className="mt-3 grid grid-cols-3 gap-4">
//                   {videos.map((video, index) => (
//                     <div key={index} className="relative">
//                       <video src={video} controls className="w-full h-auto rounded-lg" />
//                       <button onClick={() => openDeleteVideoModal(index)} className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1">
//                         <FaTimes className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Create Product Button */}
//             <div className="mt-6 text-center">
//               <button
//                 onClick={() => setIsConfirmModalOpen(true)}
//                 disabled={!productName.trim() || !brand.trim() || !category || price <= 0 || !description.trim() || !sku.trim() || images.length === 0}
//                 className={`px-4 py-2 text-white rounded-lg shadow ${
//                   !productName.trim() || !brand.trim() || !category || price <= 0 || !description.trim() || !sku.trim() || images.length === 0
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : 'bg-indigo-600 hover:bg-indigo-500'
//                 }`}
//               >
//                 Create Product
//               </button>
//             </div>
//           </div>
//         </div>
//       </Dialog>

//       {/* Confirmation Modal */}
//       <Dialog open={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="relative z-[100]">
//         <div className="fixed inset-0 bg-black/30" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full">
//             <Dialog.Title className="text-lg font-semibold mb-2">
//               Confirm Product Creation
//             </Dialog.Title>
//             <p className="mb-4">Are you sure you want to create this product?</p>
//             <div className="mt-4 flex justify-end gap-3">
//               <button onClick={() => setIsConfirmModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
//               <button onClick={createProduct} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Confirm</button>
//             </div>
//           </div>
//         </div>
//       </Dialog>

//       {/* Delete Image Confirmation Modal */}
//       <Dialog open={isDeleteImageModalOpen} onClose={cancelDeleteImage} className="relative z-10">
//         <div className="fixed inset-0 bg-gray-500/75" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
//             <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
//               Are you sure you want to delete this image?
//             </Dialog.Title>
//             <div className="mt-6 flex justify-around">
//               <button onClick={confirmDeleteImage} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
//               <button onClick={cancelDeleteImage} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
//             </div>
//           </div>
//         </div>
//       </Dialog>

//       {/* Cancel Confirmation Modal */}
//       <Dialog open={isCancelModalOpen} onClose={cancelCloseModal} className="relative z-10">
//         <div className="fixed inset-0 bg-gray-500/75" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
//             <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
//               Are you sure you want to close?
//             </Dialog.Title>
//             <p className="text-center text-gray-600 mt-2">All your filled details will be lost.</p>
//             <div className="mt-6 flex justify-around">
//               <button onClick={confirmCloseModal} className="px-4 py-2 bg-red-600 text-white rounded-lg">Confirm</button>
//               <button onClick={cancelCloseModal} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
//             </div>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   )
// }