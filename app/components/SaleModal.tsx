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
                <button onClick={() => confirmAction("updateSale")} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                  {loading ? "Saving..." : (category?.saleStatus === "Active" || category?.saleStatus === "Pending") ? "Update Sale" : "Save"}
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
            <p className="mt-2 text-gray-600">This action cannot be undone.</p>
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


// import React, { useState, useEffect } from "react";
// import { Dialog } from '@headlessui/react';
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs, { Dayjs } from "dayjs";
// import { Category } from "../types/interfaces";

// interface SaleModalProps {
//   open: boolean;
//   onClose: () => void;
//   category: Category | null;
//   refreshCategories: () => void;
// }

// const SaleModal: React.FC<SaleModalProps> = ({ open, onClose, category, refreshCategories }) => {
//   const [startDate, setStartDate] = useState<Dayjs | null>(null);
//   const [endDate, setEndDate] = useState<Dayjs | null>(null);
//   const [percentage, setPercentage] = useState<number | "">(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (category) {
//       setStartDate(category.saleStartDate ? dayjs(category.saleStartDate) : null);
//       setEndDate(category.saleEndDate ? dayjs(category.saleEndDate) : null);
//       setPercentage(category.salePercentage || "");
//     }
//   }, [category]);

//   const resetState = () => {
//     setStartDate(null);
//     setEndDate(null);
//     setPercentage("");
//   };

//   const handleAction = async (action: "startNow" | "cancelSale" | "endNow") => {
//     setLoading(true);
//     try {
//       await fetch(`http://localhost:5000/api/categories/${category?._id}/update-sale`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action }),
//       });

//       refreshCategories();
//       onClose();
//       resetState();
//     } catch (error) {
//       console.error("Error updating sale:", error);
//       alert("An error occurred while updating the sale.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!startDate || !endDate || Number(percentage) <= 0) {
//       alert("Start date, end date, and percentage are required.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const body: any = {
//         saleStartDate: startDate.toISOString(),
//         saleEndDate: endDate.toISOString(),
//         salePercentage: percentage,
//       };

//       // Add action for both Active and Pending sales
//       if (category?.saleStatus === "Active" || category?.saleStatus === "Pending") {
//         body.action = "updateSale";
//       }

//       await fetch(`http://localhost:5000/api/categories/${category?._id}/update-sale`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       refreshCategories();
//       onClose();
//       resetState();
//     } catch (error) {
//       console.error("Error updating sale:", error);
//       alert("An error occurred while updating the sale.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={() => { onClose(); resetState(); }} className="relative z-10">
//       <div className="fixed inset-0 bg-gray-500/75" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
//           {/* Close (X) Button */}
//           <button onClick={() => { onClose(); resetState(); }} className="absolute right-3 top-3 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
  
//           <Dialog.Title className="text-lg font-semibold text-gray-900 text-center">
//             {`Edit ${category?.saleStatus || "Inactive"} Sale for ${category?.name ? `${category?.name} Category` : "Selected Category"}`}
//           </Dialog.Title>
//           <div className="mt-4 flex flex-col gap-4">
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DateTimePicker 
//                 label="Start Date & Time" 
//                 value={startDate} 
//                 onChange={setStartDate} 
//                 className="w-full"
//               />
//               <DateTimePicker 
//                 label="End Date & Time" 
//                 value={endDate} 
//                 onChange={setEndDate} 
//                 className="w-full"
//               />
//             </LocalizationProvider>
//             <input
//               type="number"
//               value={percentage}
//               onChange={(e) => setPercentage(Number(e.target.value))}
//               className="w-full p-3 border rounded-lg"
//               placeholder="Sale Percentage"
//             />
//           </div>
  
//           {/* BUTTONS SECTION */}
//           <div className="mt-6 flex justify-between items-center">
//             {/* Left-side buttons (Conditional: Start Sale / End Sale / Cancel Sale) */}
//             <div className="flex gap-3">
//               {category?.saleStatus === "Active" && (
//                 <button
//                   onClick={() => handleAction("endNow")}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-500"
//                 >
//                   End Sale Now
//                 </button>
//               )}
//               {category?.saleStatus === "Pending" && (
//                 <>
//                   <button
//                     onClick={() => handleAction("startNow")}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
//                   >
//                     Start Sale Now
//                   </button>
//                   <button
//                     onClick={() => handleAction("cancelSale")}
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-500"
//                   >
//                     Cancel Sale
//                   </button>
//                 </>
//               )}
//             </div>
  
//             {/* Right-side buttons (Update/Save & Close) */}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => { onClose(); resetState(); }}
//                 className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
//                 disabled={loading}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-500"
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : (category?.saleStatus === "Active" || category?.saleStatus === "Pending") ? "Update Sale" : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );  
// };

// export default SaleModal;









// import * as React from 'react';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
// import { Category } from '../types/interfaces';

// interface SaleModalProps {
//   category: Category;
//   onClose: () => void;
//   onSave: (saleDetails: any) => void;
// }

// const SaleModal: React.FC<SaleModalProps> = ({ category, onClose, onSave }) => {
//   const [saleStart, setSaleStart] = React.useState<Date | null>(null);
//   const [saleEnd, setSaleEnd] = React.useState<Date | null>(null);
//   const [salePercentage, setSalePercentage] = React.useState<number | null>(null);

//   const handleSave = () => {
//     if (salePercentage && salePercentage > 99) {
//       alert('Sale percentage cannot be more than 99%');
//       return;
//     }
//     onSave({
//       saleStart,
//       saleEnd,
//       salePercentage,
//       saleStatus: 'pending', // or 'active' based on current date
//       saleStatusUpdatedAt: new Date(),
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg">
//         <h2 className="text-xl font-bold mb-4">Set Sale Details for {category.name}</h2>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
//             <DateTimePicker
//               label="Sale Start"
//               value={saleStart}
//               onChange={(newValue) => setSaleStart(newValue)}
//               viewRenderers={{
//                 hours: renderTimeViewClock,
//                 minutes: renderTimeViewClock,
//                 seconds: renderTimeViewClock,
//               }}
//             />
//             <DateTimePicker
//               label="Sale End"
//               value={saleEnd}
//               onChange={(newValue) => setSaleEnd(newValue)}
//               viewRenderers={{
//                 hours: renderTimeViewClock,
//                 minutes: renderTimeViewClock,
//                 seconds: renderTimeViewClock,
//               }}
//             />
//           </DemoContainer>
//         </LocalizationProvider>
//         <div className="mt-4">
//           <label className="block text-sm font-medium text-gray-700">Sale Percentage</label>
//           <input
//             type="number"
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             value={salePercentage || ''}
//             onChange={(e) => setSalePercentage(parseInt(e.target.value, 10))}
//             min="0"
//             max="99"
//           />
//         </div>
//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={onClose}
//             className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SaleModal;