// CreateProduct Component
'use client'

import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FaPlusCircle, FaTimes } from 'react-icons/fa'
import { RxCrossCircled } from "react-icons/rx";
import { useCategoryStore } from "../stores/useCategoryStore";
import { IoIosArrowRoundDown } from "react-icons/io";
import { useProductStore } from '../stores/useProductStore';
import { ChangeEvent } from 'react'; // Import ChangeEvent from React

export default function CreateProduct() {

  const { categories , fetchCategories  } = useCategoryStore(); 

  const [isOpen, setIsOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false)
  const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [productName, setProductName] = useState('')
  const [tagline, setTagline] = useState('');
  const [brand, setBrand] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [price, setPrice] = useState(''); 
  const [totalStock, settotalStock] = useState(''); 
  const [ratings, setRatings] = useState(''); 
  const [dimensions, setDimensions] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [video, setVideo] = useState<string>(''); // Updated state for videos
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')
  
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories(); // Ensure categories are fetched when the product form loads
    }
  }, [fetchCategories, categories.length]);

  const resetForm = () => {
    setProductName('')
    setTagline('');
    setBrand('')
    setCategoryID('')
    setPrice(''); // Reset to empty string
    settotalStock(''); // Reset to empty string
    setRatings(''); // Reset to empty string
    setDimensions('')
    setDescription('')
    setImages([])
    setVideo('')
    setNewImageUrl('')
    setNewVideoUrl('')
  }

  const closeCreateProductModal = () => {
    if (
      productName.trim() ||
      tagline.trim() ||
      brand.trim() ||
      categoryID ||
      (price !== '' && Number(price) > 0) || // Convert price to number
      (totalStock !== '' && Number(totalStock) > 0) || // Convert totalStock to number
      (ratings !== '' && Number(ratings) > 0) || // Convert ratings to number
      description.trim() ||
      images.length > 0 ||
      video.length > 0
    ) {
      setIsCancelModalOpen(true);
    } else {
      setIsOpen(false);
      resetForm();
    }
  };

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

  const openDeleteImageModal = (index: number) => {
    setSelectedImageIndex(index); // Set the selected image index
    setIsDeleteImageModalOpen(true); // Open the delete modal
  };

  const confirmDeleteImage = () => {
    if (selectedImageIndex !== null) {
      setImages(images.filter((_, i) => i !== selectedImageIndex))
    }
    setIsDeleteImageModalOpen(false)
    setSelectedImageIndex(null)
  }

  const confirmDeleteVideo = () => {
    setVideo(''); // Clear the single video URL
    setIsDeleteVideoModalOpen(false); // Close the delete modal
  };

  const cancelDeleteImage = () => {
    setIsDeleteImageModalOpen(false)
    setSelectedImageIndex(null)
  }

  const cancelDeleteVideo = () => {
    setIsDeleteVideoModalOpen(false)
  }

  // Add Video Function (only one video allowed)
  const addVideo = () => {
    const trimmedVideoUrl = newVideoUrl.trim();
    if (trimmedVideoUrl) {
      setVideo(trimmedVideoUrl); // Set the single video URL
      setNewVideoUrl(''); // Clear the input
    }
  };

  // Remove Video Function
  const removeVideo = () => {
    setVideo(''); // Clear the video
  };

  // Price Input Handler
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 99999)) {
      setPrice(value);
    }
  };

  // Stock Input Handler
  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 9999)) {
      settotalStock(value);
    }
  };

  // Ratings Input Handler
  const handleRatingsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 5 && /^\d*(\.\d{0,1})?$/.test(value))) {
      setRatings(value);
    }
  };

  const createProduct = async () => {
    try {
      const productData = {
        name: productName.trim(),
        brand: brand.trim(),
        tagline: tagline.trim(),
        categoryID,
        price: price === '' ? 0 : Number(price), // Convert empty string to 0
        totalStock: totalStock === '' ? 0 : Number(totalStock), // Convert empty string to 0
        ratings: ratings === '' ? 0 : Number(ratings), // Convert empty string to 0
        dimensions: dimensions.trim(),
        description: description.trim(),
        images,
        video: video, // Send single video URL
        inStock: totalStock === '' ? false : Number(totalStock) > 0, // Handle empty stock
      };
  
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json(); // ✅ Get error detail
  
      if (response.ok) {
        useProductStore.getState().triggerRefresh();
        console.log("Product created:", productData.name);
        setIsOpen(false);
        setIsConfirmModalOpen(false);
        resetForm();
      } else {
        console.error("Server error:", responseData);
        throw new Error(responseData.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

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
            <div className="sticky top-0 bg-slate-100 z-10 pb-2 rounded-md ">
              {/* Close (X) Button */}
              <button onClick={closeCreateProductModal} className="absolute right-2 top-[2px] pt-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none">
                <RxCrossCircled className="w-6 h-6" />
              </button>

              <Dialog.Title className="text-lg font-semibold text-gray-900 text-center pt-2">
                Create Your New Product
              </Dialog.Title>
            </div>

            {/* First Row: Product Name, Brand, Category */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-900">Product Name</label>
                <div className="mt-2">
                  <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter product name" />
                </div>
              </div>

              {/* Tagline Input */}
              <div>
                <label htmlFor="tagline" className="block text-sm font-medium text-gray-900">Tagline</label>
                <div className="mt-2">
                  <input id="tagline" type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter a tagline (max 50 characters)" maxLength={50} />
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
                  <select id="category" value={categoryID} onChange={(e) => setCategoryID(e.target.value)} className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" >
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
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-900">Price</label>
                <div className="mt-2">
                  <input id="price" type="number" value={price} onChange={handlePriceChange} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter price" min="0" max="99999" />
                </div>
              </div>
              
              <div>
                <label htmlFor="totalStock" className="block text-sm font-medium text-gray-900">Stock</label>
                <div className="mt-2">
                  <input id="totalStock" type="number" value={totalStock} onChange={handleStockChange} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter totalStock" min="0" max="9999" />
                </div>
              </div>

              {/* Ratings Input */}
              <div>
                <label htmlFor="ratings" className="block text-sm font-medium text-gray-900">Ratings</label>
                <div className="mt-2">
                  <input id="ratings" type="number" value={ratings} onChange={handleRatingsChange} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter ratings (0 to 5)" min="0" max="5" step="0.1" />
                </div>
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-900">Dimensions (Optional)</label>
                <div className="mt-2">
                  <input id="dimensions" type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" placeholder="Enter dimensions" maxLength={25} />
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
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-900">Video (Optional)</label>
                <div className="flex gap-2 mt-1">
                  <input
                    id="videoUrl"
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    placeholder="Enter video URL"
                    disabled={!!video} // Disable if video is already added
                  />
                  <button
                    onClick={addVideo}
                    disabled={!newVideoUrl.trim() || !!video} // Disable if video already exists
                    className={`px-4 py-2 rounded-lg shadow ${
                      !newVideoUrl.trim() || !!video
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-500'
                    }`}
                  >
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
              {/* Display Video */}
              {video && (
                <div className="relative w-32 h-32">
                  <video src={video} controls className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => setIsDeleteVideoModalOpen(true)}
                    className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Create Product Button */}
            <div className="mt-3 text-center">
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={
                  !productName.trim() ||
                  !tagline.trim() ||
                  !brand.trim() ||
                  !categoryID ||
                  (price === '' || Number(price) <= 0) || // Convert price to number
                  (totalStock === '' || Number(totalStock) <= 0) || // Convert totalStock to number
                  (ratings === '' || Number(ratings) <= 0) || // Convert ratings to number
                  !description.trim() ||
                  images.length === 0
                }
                className={`px-24 py-2 text-white rounded-lg shadow ${
                  !productName.trim() ||
                  !tagline.trim() ||
                  !brand.trim() ||
                  !categoryID ||
                  (price === '' || Number(price) <= 0) ||
                  (totalStock === '' || Number(totalStock) <= 0) ||
                  (ratings === '' || Number(ratings) <= 0) ||
                  !description.trim() ||
                  images.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                Add Product
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