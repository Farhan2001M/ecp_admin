import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface SaleModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string | null; // Pass category ID to update the correct entry
  refreshCategories: () => void; // Function to refresh the categories after update
}

const SaleModal: React.FC<SaleModalProps> = ({ open, onClose, categoryId, refreshCategories }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [percentage, setPercentage] = useState<number | "">(10);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!categoryId) {
      console.error("No category ID provided!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/update-sale`, { 
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          saleStartDate: startDate ? startDate.toISOString() : null,
          saleEndDate: endDate ? endDate.toISOString() : null,
          salePercentage: percentage,
        }),
      });
  
      const data = await response.json();
      console.log("Response:", data);
  
      if (response.ok) {
        alert("Sale updated successfully!");
        refreshCategories();
        onClose();
      } else {
        alert(`Failed to update sale: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      alert("An error occurred while updating the sale.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Sale</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Start Date & Time"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DateTimePicker
            label="End Date & Time"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </LocalizationProvider>
        <TextField
          label="Sale Percentage"
          type="number"
          fullWidth
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleModal;





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