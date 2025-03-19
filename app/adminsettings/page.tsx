"use client";
import React, { useEffect, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { Avatar, Fab } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { arrayMoveImmutable } from "array-move";
import Layout from "../components/Layout";
import { useImageStore } from "../stores/useImageStore";

const AdminSettings: React.FC = () => {
  const { urls, fetchImages, addImage, updateImageOrder, removeImage, clearImages } = useImageStore();
  const [inputUrl, setInputUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch images once when the component mounts
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleAddImage = () => {
    if (inputUrl.trim() && urls.length < 10) {
      addImage(inputUrl.trim()); // Add to local state only
      setInputUrl("");
    }
  };

  const handleDeleteImage = (index: number) => {
    removeImage(index); // Remove from local state
  };

  const handlePublishImages = async () => {
    if (urls.length === 0) return;

    setIsPublishing(true);
    try {
      await updateImageOrder(urls); // Update the database with the final list
      alert("Images published successfully!");
      clearImages(); // Clear the local state after publishing
    } catch (error) {
      console.error("Error publishing images:", error);
      alert("An error occurred while publishing images.");
    } finally {
      setIsPublishing(false);
    }
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const newUrls = arrayMoveImmutable(urls, oldIndex, newIndex);
    useImageStore.setState({ urls: newUrls }); // Update local state
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center mb-4">Admin Settings</h1>

      {/* Input and Add Button */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter image URL"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={urls.length >= 10}
        />
        <button
          onClick={handleAddImage}
          disabled={!inputUrl.trim() || urls.length >= 10}
          className={`px-4 py-2 rounded-lg ${
            !inputUrl.trim() || urls.length >= 10
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          Add Image
        </button>
      </div>

      {/* Sortable Image List */}
      <SortableList
        onSortEnd={onSortEnd}
        className="flex flex-wrap justify-center gap-4 select-none"
        draggedItemClassName="shadow-2xl opacity-75"
      >
        {urls.map((url, index) => (
          <SortableItem key={index}>
            <div className="relative flex-shrink-0 cursor-grab shadow-lg rounded-full">
              <Avatar
                className="w-36 h-36"
                alt={`Image ${index + 1}`}
                src={url}
                imgProps={{ draggable: false }}
              />
              <Fab
                color="primary"
                size="small"
                className="absolute bottom-1 right-1"
                aria-label="delete"
                onClick={() => handleDeleteImage(index)}
              >
                <DeleteIcon />
              </Fab>
            </div>
          </SortableItem>
        ))}
      </SortableList>

      {/* Publish Button */}
      <div className="mt-4 text-center">
        <button
          onClick={handlePublishImages}
          disabled={urls.length === 0 || isPublishing}
          className={`px-4 py-2 rounded-lg ${
            urls.length === 0 || isPublishing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-500"
          }`}
        >
          {isPublishing ? "Publishing..." : "Publish Images"}
        </button>
      </div>
    </Layout>
  );
};

export default AdminSettings;







// // app/adminsettings/page.tsx
// "use client";
// import React, { useState } from "react";
// import SortableList, { SortableItem } from "react-easy-sort";
// import { Avatar, Fab } from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import { arrayMoveImmutable } from "array-move";
// import Layout from "../components/Layout";

// const AdminSettings: React.FC = () => {
//   const [imageUrls, setImageUrls] = useState<string[]>([]);
//   const [inputUrl, setInputUrl] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   const handleAddImage = () => {
//     if (inputUrl.trim() && imageUrls.length < 10) {
//       setImageUrls([...imageUrls, inputUrl.trim()]);
//       setInputUrl("");
//     }
//   };

//   const handlePublishImages = async () => {
//     if (imageUrls.length === 0) return;

//     setIsPublishing(true);
//     try {
//       const response = await fetch("http://localhost:5000/api/images/publish", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ urls: imageUrls }),
//       });

//       if (response.ok) {
//         alert("Images published successfully!");
//         setImageUrls([]); // Clear the images after publishing
//       } else {
//         alert("Failed to publish images.");
//       }
//     } catch (error) {
//       console.error("Error publishing images:", error);
//       alert("An error occurred while publishing images.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   const onSortEnd = (oldIndex: number, newIndex: number) => {
//     setImageUrls((array) => arrayMoveImmutable(array, oldIndex, newIndex));
//   };

//   return (
//     <Layout>
//       <h1 className="text-2xl font-bold text-center mb-4">Admin Settings</h1>

//       {/* Input and Add Button */}
//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           value={inputUrl}
//           onChange={(e) => setInputUrl(e.target.value)}
//           placeholder="Enter image URL"
//           className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={imageUrls.length >= 10}
//         />
//         <button
//           onClick={handleAddImage}
//           disabled={!inputUrl.trim() || imageUrls.length >= 10}
//           className={`px-4 py-2 rounded-lg ${
//             !inputUrl.trim() || imageUrls.length >= 10
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 text-white hover:bg-blue-500"
//           }`}
//         >
//           Add Image
//         </button>
//       </div>

//       {/* Sortable Image List */}
//       <SortableList
//         onSortEnd={onSortEnd}
//         className="flex flex-wrap justify-center gap-4 select-none"
//         draggedItemClassName="shadow-2xl opacity-75"
//       >
//         {imageUrls.map((url, index) => (
//           <SortableItem key={index}>
//             <div className="relative flex-shrink-0 cursor-grab shadow-lg rounded-full">
//               <Avatar
//                 className="w-36 h-36"
//                 alt={`Image ${index + 1}`}
//                 src={url}
//                 imgProps={{ draggable: false }}
//               />
//               <Fab
//                 color="primary"
//                 size="small"
//                 className="absolute bottom-1 right-1"
//                 aria-label="like"
//                 onClick={() => alert(`You liked image ${index + 1}`)}
//               >
//                 <FavoriteIcon />
//               </Fab>
//             </div>
//           </SortableItem>
//         ))}
//       </SortableList>

//       {/* Publish Button */}
//       <div className="mt-4 text-center">
//         <button
//           onClick={handlePublishImages}
//           disabled={imageUrls.length === 0 || isPublishing}
//           className={`px-4 py-2 rounded-lg ${
//             imageUrls.length === 0 || isPublishing
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-green-600 text-white hover:bg-green-500"
//           }`}
//         >
//           {isPublishing ? "Publishing..." : "Publish Images"}
//         </button>
//       </div>
//     </Layout>
//   );
// };

// export default AdminSettings;












// // // app/adminsettings/page.tsx

// "use client";
// import React from "react";
// import SortableList, { SortableItem } from "react-easy-sort";
// import { Avatar, Fab } from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import { arrayMoveImmutable } from "array-move";
// import Layout from "../components/Layout";

// const AdminSettings: React.FC = () => {
//   const [items, setItems] = React.useState([
//     {
//       name: "Alpha",
//       image:
//         "https://i.pinimg.com/736x/ae/c4/53/aec453161b2f33ffc6219d8a758307a9.jpg",
//     },
//     {
//       name: "Charlie",
//       image:
//         "https://topdogtips.com/wp-content/uploads/2014/12/Top-10-Cute-Dog-Breeds-Who-Wins-1.jpg",
//     },
//     {
//       name: "Delta",
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQFNTv7ogK6omzBeZSWZOVJ7ZDqYi51MdJq6g&usqp=CAU",
//     },
//     {
//       name: "Echo",
//       image:
//         "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=640:*",
//     },
//     {
//       name: "Foxtrot",
//       image:
//         "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/beau-enjoying-his-freedom-in-ohio-us-on-july-28-2015-a-cute-news-photo-484455470-1551896268.jpg?crop=0.419xw:1.00xh;0.236xw,0&resize=480:*",
//     },
//     {
//       name: "Hotel",
//       image:
//         "https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=282_200",
//     },
//   ]);

//   const onSortEnd = (oldIndex: number, newIndex: number) => {
//     setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex));
//   };

//   return (
//     <Layout>
//       <h1 className="text-2xl font-bold text-center mb-4">Admin Settings</h1>

//       <SortableList
//         onSortEnd={onSortEnd}
//         className="flex flex-wrap justify-center gap-4 select-none"
//         draggedItemClassName="shadow-2xl opacity-75"
//       >
//         {items.map(({ name, image }) => (
//           <SortableItem key={name}>
//             <div className="relative flex-shrink-0 cursor-grab shadow-lg rounded-full">
//               <Avatar
//                 className="w-36 h-36"
//                 alt={name}
//                 src={image}
//                 imgProps={{ draggable: false }}
//               />
//               <Fab
//                 color="primary"
//                 size="small"
//                 className="absolute bottom-1 right-1"
//                 aria-label="like"
//                 onClick={() => alert(`${name} says Woof!`)}
//               >
//                 <FavoriteIcon />
//               </Fab>
//             </div>
//           </SortableItem>
//         ))}
//       </SortableList>
//     </Layout>
//   );
// };

// export default AdminSettings;



// // app/adminsettings/page.tsx
// import React from "react";
// import Layout from "../components/Layout";

// const AdminSettings: React.FC = () => {
//   return (
//     <Layout>
//       <h1 className="text-2xl font-bold text-center">Admin Settings</h1>
//     </Layout>
//   );
// };

// export default AdminSettings;
