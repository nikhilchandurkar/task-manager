"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"

function Profile() {
  const { currentUser, userData, fetchUserData } = useAuth()
  const [displayName, setDisplayName] = useState(userData?.displayName || currentUser?.displayName || "")
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(userData?.photoURL || currentUser?.photoURL || null)
  const [loading, setLoading] = useState(false)

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0])
      setPhotoPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUser) return

    try {
      setLoading(true)

      let photoURL = userData?.photoURL || currentUser.photoURL

      // Upload new photo if selected
      if (photoFile) {
        const storageRef = ref(storage, `profile_photos/${currentUser.uid}`)
        await uploadBytes(storageRef, photoFile)
        photoURL = await getDownloadURL(storageRef)
      }

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName,
        photoURL,
      })

      // Update Firestore user document
      const userRef = doc(db, "users", currentUser.uid)
      await updateDoc(userRef, {
        displayName,
        photoURL,
      })

      // Refresh user data
      await fetchUserData(currentUser.uid)

      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={photoPreview || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>

              <div className="text-center">
                <p className="text-gray-600">{userData?.email || currentUser?.email}</p>
              </div>
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile



// "use client"

// import { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { updateProfile } from "firebase/auth";
// import { doc, updateDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db, storage } from "../firebase";
// import { toast } from "react-toastify";
// import Navbar from "../components/Navbar";

// function Profile() {
//   const { currentUser, userData, fetchUserData } = useAuth();
//   const [displayName, setDisplayName] = useState("");
//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoURL, setPhotoURL] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (userData || currentUser) {
//       setDisplayName(userData?.displayName || currentUser?.displayName || "");
//       setPhotoURL(userData?.photoURL || currentUser?.photoURL || "");
//     }
//   }, [userData, currentUser]);

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         return toast.error("Only image files are allowed");
//       }
//       if (file.size > 2 * 1024 * 1024) {
//         return toast.error("File size must be under 2MB");
//       }
//       setPhotoFile(file);
//       setPhotoURL(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!currentUser) return;

//     try {
//       setLoading(true);
//       let updatedPhotoURL = photoURL;

//       if (photoFile) {
//         const storageRef = ref(storage, `profile_photos/${currentUser.uid}`);
//         await uploadBytes(storageRef, photoFile);
//         updatedPhotoURL = await getDownloadURL(storageRef);
//       }

//       await updateProfile(currentUser, { displayName, photoURL: updatedPhotoURL });

//       const userRef = doc(db, "users", currentUser.uid);
//       await updateDoc(userRef, { displayName, photoURL: updatedPhotoURL });

//       await fetchUserData(currentUser.uid);

//       toast.success("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="container mx-auto px-4 py-6">
//         <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
//           <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="relative">
//                 <img
//                   src={photoURL || "https://via.placeholder.com/150"}
//                   alt="Profile"
//                   className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
//                 />
//                 <label
//                   htmlFor="photo-upload"
//                   className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
//                   aria-label="Upload profile picture"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                   </svg>
//                 </label>
//                 <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
//               </div>
//               <div className="text-center">
//                 <p className="text-gray-600">{userData?.email || currentUser?.email}</p>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
//                 Display Name
//               </label>
//               <input
//                 type="text"
//                 id="displayName"
//                 value={displayName}
//                 onChange={(e) => setDisplayName(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;
