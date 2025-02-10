// NewCategory Component
'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FaPlusCircle, FaTimes } from 'react-icons/fa'
import { DndContext, DragEndEvent } from '@dnd-kit/core' 
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { RxCrossCircled } from "react-icons/rx";
import { useCategoryStore } from "../stores/useCategoryStore";

export default function CreateCategory() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [servingSizes, setServingSizes] = useState<string[]>([])
  const [newServing, setNewServing] = useState('')
  const [selectedServingIndex, setSelectedServingIndex] = useState<number | null>(null)
  const [selectedServingName, setSelectedServingName] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false) 
  
  const resetForm = () => {
    setCategoryName('')
    setServingSizes([])
    setNewServing('')
  }

  const closeCreateCategoryModal = () => {
    if (categoryName.trim() || servingSizes.length > 0) {
      // If user has entered details, show confirmation modal
      setIsCancelModalOpen(true)
    } else {
      // Otherwise, close modal directly
      setIsOpen(false)
      resetForm()
    }
  }

  // Confirm closing and resetting all data
  const confirmCloseModal = () => {
    setIsCancelModalOpen(false)
    setIsOpen(false)
    resetForm()
  }

  // Close cancel confirmation modal without closing main modal
  const cancelCloseModal = () => {
    setIsCancelModalOpen(false)
  }

  // Add a serving size
  const addServingSize = () => {
    // Remove leading and trailing spaces from newServing
    const trimmedServing = newServing.trim();
  
    // If the trimmed value is not empty
    if (trimmedServing) {
      // Check if the trimmedServing already exists
      if (servingSizes.includes(trimmedServing)) {
        console.warn(`Serving size "${trimmedServing}" already exists!`);
      } else {
        // Add the new serving to the list
        setServingSizes([...servingSizes, trimmedServing]);
        setNewServing(''); // Reset the input field
      }
    }
  }
  

  // Remove a serving size
  const removeServingSize = (index: number) => {
    setServingSizes(servingSizes.filter((_, i) => i !== index))
  }

  // Open delete confirmation modal and set selected serving name
  const openDeleteModal = (index: number) => {
    setSelectedServingIndex(index);
    setSelectedServingName(servingSizes[index]); // Store the serving name
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedServingIndex !== null) {
      console.log(`Deleted Serving: ${selectedServingName}`); // Log the deleted serving
      removeServingSize(selectedServingIndex);
    }
    setIsDeleteModalOpen(false);
    setSelectedServingIndex(null);
    setSelectedServingName(null);
  };

  // Close delete modal without deleting
  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setSelectedServingIndex(null)
  }

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    input = input.replace(/^\s+/, ''); // Remove leading spaces
    if (input) {
      input = input.charAt(0).toUpperCase() + input.slice(1); // Capitalize first letter
    }
    setCategoryName(input);
  };

  const handleServingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/^\s+/, ''); // Remove leading spaces
    const regex = /^[a-zA-Z0-9.]*$/;
    if (!regex.test(value)) {
      console.log("You cannot write special characters");
    } else {
      if (value) {
        value = value.charAt(0).toUpperCase() + value.slice(1); // Capitalize first letter
      }
      setNewServing(value);
    }
  };

  // Submit category to MongoDB (via backend API)
  const createCategory = async () => {
    try {
      let trimmedCategoryName = categoryName.trim().replace(/\s+/g, ' ');
      if (!trimmedCategoryName) return;
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedCategoryName, servings: servingSizes })
      });
      if (response.ok) {
        useCategoryStore.getState().triggerRefresh(); // ✅ Ensure fetch is triggered
        alert('Category created successfully!');
        setIsOpen(false);
        resetForm();
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating category');
    }
  };
  

  // Handle the drag end event to reorder the items
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

  // Draggable Serving Item Component
  const DraggableServing = ({ size, index }: { size: string, index: number }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: size, // Use the serving size as the unique id
    })

    // Style for the draggable item
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between bg-gray-100 p-2 rounded mr-2"
        {...attributes} // Drag behavior for the entire container
        {...listeners} // Drag listeners for the container
      >
        <div className="flex items-center gap-2">
          {size}
        </div>
        <button
          onClick={() => openDeleteModal(index)} // Open delete modal on click
          className="cursor-pointer"
        >
          <FaTimes className="w-4 h-4 text-red-500" />
        </button>
      </div>
    )
  }  

  return (
    <div className="">
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 flex items-center gap-2"
      >
        <FaPlusCircle />
        Create a New Category
      </button>

      {/* Modal for category creation */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            
            {/* Close (X) Button */}
            <button
              onClick={closeCreateCategoryModal}
              className="absolute right-3 top-3 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <RxCrossCircled className="w-6 h-6" />
            </button>

            <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
              Create Your New Category
            </Dialog.Title>

            {/* Category Name Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={handleCategoryNameChange}
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Enter category name"
              />
            </div>

            {/* Serving Size Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Serving Sizes</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={newServing}
                  onChange={handleServingInputChange}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="e.g., Small, Medium, Large"
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

            {/* List of Serving Sizes with scroll */}
            <div className="mt-3 max-h-40 overflow-y-auto overflow-x-hidden space-y-2">
              <DndContext onDragEnd={handleDragEnd}>
                <SortableContext
                  items={servingSizes}
                  strategy={verticalListSortingStrategy}
                >
                  {servingSizes.map((size, index) => (
                    <DraggableServing key={size} size={size} index={index} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            {/* Create Category Button */}
            <div className="mt-6 text-center">
              <button
                onClick={createCategory}
                disabled={!categoryName.trim() || servingSizes.length === 0 || newServing.trim() !== ''}
                className={`px-4 py-2 text-white rounded-lg shadow ${
                  !categoryName.trim() || servingSizes.length === 0 || newServing.trim() !== ''
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`} >
                Create Category
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={cancelDelete} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
              Are you sure you want to delete this "{selectedServingName}" serrving size ?
            </Dialog.Title>
            <div className="mt-6 flex justify-around">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
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
              <button
                onClick={confirmCloseModal}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={cancelCloseModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
