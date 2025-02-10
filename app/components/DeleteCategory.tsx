// components/DeleteCategory.tsx
'use client'

import { Dialog } from '@headlessui/react'
import { useState, useEffect }from 'react'
import { useCategoryStore } from "../stores/useCategoryStore"
import { Category } from "../types/interfaces"

interface DeleteCategoryProps {
  category: Category;
  onClose: () => void;
}

export default function DeleteCategory({ category, onClose }: DeleteCategoryProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isNameConfirmOpen, setIsNameConfirmOpen] = useState(false)
  const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false)
  const [confirmationName, setConfirmationName] = useState('')


  // Reset all states when closing
  const handleClose = () => {
    setIsOpen(false)
    setIsNameConfirmOpen(false)
    setIsFinalConfirmOpen(false)
    setConfirmationName('')
    onClose()
  }

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/categories/${category._id}`, {
        method: "DELETE",
      })
      useCategoryStore.getState().removeCategory(category._id)
      handleClose()
    } catch (error) {
      console.error("Failed to delete category:", error)
    } finally {
      setIsOpen(false)
    }
  }

  // Add this useEffect to handle external close
  useEffect(() => {
    if (!isOpen && !isNameConfirmOpen && !isFinalConfirmOpen) {
      handleClose()
    }
  }, [isOpen, isNameConfirmOpen, isFinalConfirmOpen])

  return (
    <>
      {/* Initial Confirmation Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Delete Category
            </Dialog.Title>
            <p className="mb-4">Are you sure you want to delete this category?</p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setIsNameConfirmOpen(true)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Name Confirmation Modal */}
      <Dialog open={isNameConfirmOpen} onClose={() => setIsNameConfirmOpen(false)} className="relative z-[60]">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Confirm Category Name
            </Dialog.Title>
            <p className="mb-2">Please type <strong>{category.name}</strong> to confirm deletion.</p>
            
            <input
              type="text"
              value={confirmationName}
              onChange={(e) => setConfirmationName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter category name"
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmationName === category.name) {
                    setIsNameConfirmOpen(false)
                    setIsFinalConfirmOpen(true)
                  }
                }}
                disabled={confirmationName !== category.name}
                className={`px-4 py-2 rounded ${
                  confirmationName !== category.name 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Final Confirmation Modal */}
      <Dialog open={isFinalConfirmOpen} onClose={() => setIsFinalConfirmOpen(false)} className="relative z-[70]">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-2 text-red-600">
              ⚠️ Permanent Deletion
            </Dialog.Title>
            <p className="mb-4">This action cannot be undone. This will permanently delete the <strong>{category.name}</strong> category and all associated data such its <strong> Products </strong> and thier related info.</p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}