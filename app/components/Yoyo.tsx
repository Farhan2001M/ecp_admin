import React, { useState, useEffect } from "react";
import { Dialog } from '@headlessui/react';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Category } from "../types/interfaces";
import { RxCrossCircled } from "react-icons/rx";

interface SaleModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  refreshCategories: () => void;
}

const SaleModal: React.FC<SaleModalProps> = ({ open, onClose, category, refreshCategories }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [percentage, setPercentage] = useState<number | "">(0);
  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showActionConfirmModal, setShowActionConfirmModal] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<"startNow" | "cancelSale" | "endNow" | "updateSale" | null>(null);
  
  const isFormValid = startDate !== null && endDate !== null && percentage !== "";

  useEffect(() => {
    if (category) {
      const initialStart = category.saleStartDate ? dayjs(category.saleStartDate) : null;
      const initialEnd = category.saleEndDate ? dayjs(category.saleEndDate) : null;
      const initialPercentage = category.salePercentage || "";

      setStartDate(initialStart);
      setEndDate(initialEnd);
      setPercentage(initialPercentage);
      setIsModified(false);
    }
  }, [category]);

  const resetState = () => {
    setStartDate(null);
    setEndDate(null);
    setPercentage("");
    setIsModified(false);
  };

  const handleAction = async (action: "startNow" | "cancelSale" | "endNow" | "updateSale") => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/categories/${category?._id}/update-sale`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      refreshCategories();
      onClose();
      resetState();
    } catch (error) {
      console.error("Error updating sale:", error);
      alert("An error occurred while updating the sale.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!startDate || !endDate || Number(percentage) <= 0) {
      alert("Start date, end date, and percentage are required.");
      return;
    }

    setLoading(true);
    try {
      const body: any = {
        saleStartDate: startDate.toISOString(),
        saleEndDate: endDate.toISOString(),
        salePercentage: percentage,
      };

      if (category?.saleStatus === "Active" || category?.saleStatus === "Pending") {
        body.action = "updateSale";
      }

      await fetch(`http://localhost:5000/api/categories/${category?._id}/update-sale`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      refreshCategories();
      onClose();
      resetState();
    } catch (error) {
      console.error("Error updating sale:", error);
      alert("An error occurred while updating the sale.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isModified) {
      setShowConfirmModal(true);
    } else {
      onClose();
      resetState();
    }
  };

  const confirmAction = (action: "startNow" | "cancelSale" | "endNow" | "updateSale") => {
    setActionToConfirm(action);
    setShowActionConfirmModal(true);
  };

  const executeConfirmedAction = () => {
    if (actionToConfirm) {
      if (actionToConfirm === "updateSale") {
        handleSave();
      } else {
        handleAction(actionToConfirm);
      }
      setShowActionConfirmModal(false);
    }
  };

  return (
    <>
      {/* Sale Modal */}
      <Dialog open={open} onClose={handleClose} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            {/* Close Button */}
            <button onClick={handleClose} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
              <RxCrossCircled className="w-6 h-6" />
            </button>

            <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
              {`Edit ${category?.saleStatus || "Inactive"} Sale for ${category?.name || "Selected Category"}`}
            </Dialog.Title>
            <div className="mt-4 flex flex-col gap-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker 
                  label="Start Date & Time" 
                  value={startDate} 
                  onChange={(value) => { setStartDate(value); setIsModified(true); }} 
                  className="w-full"
                />
                <DateTimePicker 
                  label="End Date & Time" 
                  value={endDate} 
                  onChange={(value) => { setEndDate(value); setIsModified(true); }} 
                  className="w-full"
                />
              </LocalizationProvider>
              <input
                type="number"
                value={percentage}
                onChange={(e) => { setPercentage(Number(e.target.value)); setIsModified(true); }}
                className="w-full p-3 border rounded-lg"
                placeholder="Sale Percentage"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <div className="flex gap-3">
                {category?.saleStatus === "Active" && (
                  <button onClick={() => confirmAction("endNow")} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                    End Sale Now
                  </button>
                )}
                {category?.saleStatus === "Pending" && (
                  <>
                    <button onClick={() => confirmAction("startNow")} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      Start Sale Now
                    </button>
                    <button onClick={() => confirmAction("cancelSale")} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                      Cancel Sale
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={handleClose} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                  Close
                </button>
                <button 
                  onClick={() => confirmAction("updateSale")} 
                  className={`px-4 py-2 rounded-lg ${isFormValid ? "bg-green-600 text-white" : "border-1 border-gray-500 text-gray-500 cursor-not-allowed"}`}
                  disabled={!isFormValid}
                >
                  {loading ? "Saving..." : (category?.saleStatus === "Active" || category?.saleStatus === "Pending") ? "Update Sale" : "Confirm Sale"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Confirmation Modal for Unsaved Changes */}
      <Dialog open={showConfirmModal} onClose={() => setShowConfirmModal(false)} className="relative z-20">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
              Are you sure you want to close?  
            </Dialog.Title>
            <p className="text-center text-gray-600 mt-2">All your filled details will be lost.</p>

            <div className="mt-6 flex justify-around">
              <button onClick={() => { onClose(); resetState(); setShowConfirmModal(false); }} className="px-4 py-2 bg-red-600 text-white rounded-lg" > Confirm </button>
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg" >  Cancel </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Confirmation Modal for Actions */}
      <Dialog open={showActionConfirmModal} onClose={() => setShowActionConfirmModal(false)} className="relative z-30">
        <div className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-gray-900 text-center"> Are you sure? </Dialog.Title>
            <p className="text-center mt-2 text-gray-600">This action cannot be undone.</p>
            <div className="mt-6 flex justify-around">
              <button onClick={executeConfirmedAction} className="px-4 py-2 bg-red-600 text-white rounded-lg" > Delete </button>
              <button onClick={() => setShowActionConfirmModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg" > Cancel </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SaleModal;
