// components/EditCategory.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { RxCrossCircled } from "react-icons/rx";
import { useCategoryStore } from "../stores/useCategoryStore";
import { Category } from "../types/interfaces";
import { Switch } from '@headlessui/react'

interface EditCategoryProps {
  category: Category;
  onClose: () => void;
}

export default function EditCategory({ category, onClose }: EditCategoryProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [categoryName, setCategoryName] = useState(category.name)
  const [servingSizes, setServingSizes] = useState<string[]>(category.servings)
  const [newServing, setNewServing] = useState('')
  const [selectedServingIndex, setSelectedServingIndex] = useState<number | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isActive, setIsActive] = useState(category.isactive)
  const [isHighlighted, setIsHighlighted] = useState(category.highlighted)
  const [hasChanges, setHasChanges] = useState(false)
  const [isUpdateConfirmModalOpen, setIsUpdateConfirmModalOpen] = useState(false)
  const [isFinalConfirmModalOpen, setIsFinalConfirmModalOpen] = useState(false)

  useEffect(() => {
    const originalState = {
      name: category.name,
      servings: category.servings,
      isactive: category.isactive,
      highlighted: category.highlighted
    }
    
    const currentState = {
      name: categoryName,
      servings: servingSizes,
      isactive: isActive,
      highlighted: isHighlighted
    }

    setHasChanges(JSON.stringify(originalState) !== JSON.stringify(currentState))
  }, [categoryName, servingSizes, isActive, isHighlighted])

  const resetForm = () => {
    setCategoryName(category.name)
    setServingSizes(category.servings)
    setIsActive(category.isactive)
    setIsHighlighted(category.highlighted)
    setNewServing('')
  }

  const closeEditModal = () => {
    if (hasChanges) {
      setIsCancelModalOpen(true)
    } else {
      handleClose()
    }
  }

  // Update the handleClose function
  const handleClose = () => {
    setIsOpen(false)
    setIsCancelModalOpen(false)
    setIsDeleteModalOpen(false)
    resetForm()
    onClose()
  }

  const addServingSize = () => {
    const trimmedServing = newServing.trim()
    if (trimmedServing && !servingSizes.includes(trimmedServing)) {
      setServingSizes([...servingSizes, trimmedServing])
      setNewServing('')
    }
  }

  const removeServingSize = (index: number) => {
    setServingSizes(servingSizes.filter((_, i) => i !== index))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = servingSizes.indexOf(active.id as string)
      const newIndex = servingSizes.indexOf(over?.id as string)
      const updatedServingSizes = [...servingSizes]
      updatedServingSizes.splice(oldIndex, 1)
      updatedServingSizes.splice(newIndex, 0, active.id as string)
      setServingSizes(updatedServingSizes)
    }
  }

  // Add these new functions
  const handleUpdateConfirmation = () => {
    setIsUpdateConfirmModalOpen(true)
  }

  const handleFinalConfirmation = () => {
    setIsUpdateConfirmModalOpen(false)
    setIsFinalConfirmModalOpen(true)
  }

  const confirmUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${category._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryName.trim(),
          servings: servingSizes,
          isactive: isActive,
          highlighted: isHighlighted
        })
      })

      if (response.ok) {
        useCategoryStore.getState().triggerRefresh()
        handleClose()
      } else {
        throw new Error('Failed to update category')
      }
    } catch (error) {
      console.error(error)
      alert('Error updating category')
    } finally {
      setIsFinalConfirmModalOpen(false)
    }
  }

  const DraggableServing = ({ size, index }: { size: string, index: number }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: size,
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between bg-gray-100 p-2 rounded mr-2"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          {size}
        </div>
        <button
          onClick={() => {
            setSelectedServingIndex(index)
            setIsDeleteModalOpen(true)
          }}
          className="cursor-pointer"
        >
          <FaTimes className="w-4 h-4 text-red-500" />
        </button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onClose={closeEditModal} className="relative z-50">
      <div className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <button
            onClick={closeEditModal}
            className="absolute right-3 top-3 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <RxCrossCircled className="w-6 h-6" />
          </button>

          <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
            Edit Category
          </Dialog.Title>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Serving Sizes</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={newServing}
                onChange={(e) => setNewServing(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Add new serving size"
              />
              <button
                onClick={addServingSize}
                disabled={!newServing.trim()}
                className={`px-4 py-2 rounded-lg shadow ${!newServing.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500'}`}
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext items={servingSizes} strategy={verticalListSortingStrategy}>
                {servingSizes.map((size, index) => (
                  <DraggableServing key={size} size={size} index={index} />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6">
            {/* Status Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-center">
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <Switch
                checked={isActive}
                onChange={setIsActive}
                className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  isActive ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Toggle Status</span>
                <span
                  className={`pointer-events-none relative inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </Switch>
            </div>

            {/* Fixed Separator (Centered) */}
            <div className="text-gray-400 font-bold text-lg flex-shrink-0">|</div>

            {/* Highlighted Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Highlighted:</span>
              <span className="text-sm font-semibold text-gray-900 min-w-[40px] text-center">
                {isHighlighted ? 'Yes' : 'No'}
              </span>
              <Switch
                checked={isHighlighted}
                onChange={setIsHighlighted}
                className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                  isHighlighted ? 'bg-yellow-400' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Toggle Highlighted</span>
                <span
                  className={`pointer-events-none relative inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isHighlighted ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </Switch>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleUpdateConfirmation}
              disabled={!categoryName.trim() || servingSizes.length === 0}
              className={`px-4 py-2 text-white rounded-lg shadow ${
                !categoryName.trim() || servingSizes.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              Update Category
            </button>
          </div>
        </div>
      </div>

      {/* Delete Serving Confirmation Modal */}
      <Dialog 
        open={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        className="relative z-[100]" >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold">Delete Serving Size</Dialog.Title>
            <p className="mt-2">Are you sure you want to delete this serving size?</p>
            
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedServingIndex !== null) {
                    removeServingSize(selectedServingIndex)
                    setIsDeleteModalOpen(false)
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Cancel Edit Confirmation Modal */}
      <Dialog 
        open={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        className="relative z-[100]" >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold">Unsaved Changes</Dialog.Title>
            <p className="mt-2">You have unsaved changes. Are you sure you want to close?</p>
            
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Update Confirmation Modal */}
      <Dialog 
        open={isUpdateConfirmModalOpen} 
        onClose={() => setIsUpdateConfirmModalOpen(false)} 
        className="relative z-[100]"
      >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold">Confirm Update</Dialog.Title>
            <p className="mt-2">Are you sure you want to update this category?</p>
            
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsUpdateConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalConfirmation}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Final Warning Modal */}
      <Dialog 
        open={isFinalConfirmModalOpen} 
        onClose={() => setIsFinalConfirmModalOpen(false)} 
        className="relative z-[110]"
      >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold text-red-600">
              ⚠️ Final Confirmation
            </Dialog.Title>
            <p className="mt-2">This action will update the category across the entire website. Are you absolutely sure you want to proceed?</p>
            
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsFinalConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      </Dialog>

    </Dialog>
  )
}