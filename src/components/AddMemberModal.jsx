// // // "use client"

// // // import { useState } from "react"
// // // import { useTeams } from "../contexts/TeamContext"

// // // function AddMemberModal({ isOpen, onClose, team }) {
// // //   const [email, setEmail] = useState("")
// // //   const [loading, setLoading] = useState(false)
// // //   const { addMemberToTeam } = useTeams()

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault()

// // //     if (!email.trim() || !team) return

// // //     try {
// // //       setLoading(true)
// // //       await addMemberToTeam(team.id, email)
// // //       setEmail("")
// // //       onClose()
// // //     } catch (error) {
// // //       console.error("Error adding member:", error)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   if (!isOpen || !team) return null

// // //   return (
// // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
// // //         <div className="p-6">
// // //           <div className="flex justify-between items-center mb-4">
// // //             <h2 className="text-xl font-bold">Add Team Member</h2>
// // //             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
// // //               <svg
// // //                 xmlns="http://www.w3.org/2000/svg"
// // //                 className="h-6 w-6"
// // //                 fill="none"
// // //                 viewBox="0 0 24 24"
// // //                 stroke="currentColor"
// // //               >
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //               </svg>
// // //             </button>
// // //           </div>

// // //           <p className="mb-4 text-gray-600">
// // //             Add a new member to <strong>{team.name}</strong> by entering their email address.
// // //           </p>

// // //           <form onSubmit={handleSubmit} className="space-y-4">
// // //             <div>
// // //               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
// // //                 Email Address
// // //               </label>
// // //               <input
// // //                 type="email"
// // //                 id="email"
// // //                 value={email}
// // //                 onChange={(e) => setEmail(e.target.value)}
// // //                 required
// // //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                 placeholder="Enter email address"
// // //               />
// // //             </div>

// // //             <div className="flex justify-end pt-4">
// // //               <button
// // //                 type="button"
// // //                 onClick={onClose}
// // //                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
// // //               >
// // //                 Cancel
// // //               </button>

// // //               <button
// // //                 type="submit"
// // //                 disabled={loading || !email.trim()}
// // //                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
// // //               >
// // //                 {loading ? "Adding..." : "Add Member"}
// // //               </button>
// // //             </div>
// // //           </form>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default AddMemberModal


// // "use client"

// // import { useState, useEffect } from "react"
// // import { useTeams } from "../contexts/TeamContext"
// // import { db } from "../firebase" // Ensure Firebase is properly configured
// // import { collection, getDocs } from "firebase/firestore"

// // function AddMemberModal({ isOpen, onClose, team }) {
// //   const [users, setUsers] = useState([])
// //   const [selectedUser, setSelectedUser] = useState(null)
// //   const [loading, setLoading] = useState(false)
// //   const { addMemberToTeam } = useTeams()

// //   useEffect(() => {
// //     if (!isOpen) return
    
// //     const fetchUsers = async () => {
// //       try {
// //         const usersCollection = collection(db, "users")
// //         const userSnapshot = await getDocs(usersCollection)
// //         const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
// //         setUsers(userList)
// //       } catch (error) {
// //         console.error("Error fetching users:", error)
// //       }
// //     }

// //     fetchUsers()
// //   }, [isOpen])

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()

// //     if (!selectedUser || !team) return

// //     try {
// //       setLoading(true)
// //       await addMemberToTeam(team.id, selectedUser.email) 
// //       setSelectedUser(null)
// //       onClose()
// //     } catch (error) {
// //       console.error("Error adding member:", error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   if (!isOpen || !team) return null

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
// //         <div className="p-6">
// //           <div className="flex justify-between items-center mb-4">
// //             <h2 className="text-xl font-bold">Add Team Member</h2>
// //             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="h-6 w-6"
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //                 stroke="currentColor"
// //               >
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //               </svg>
// //             </button>
// //           </div>

// //           <p className="mb-4 text-gray-600">
// //             Select a user to add to <strong>{team.name}</strong>.
// //           </p>

// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div>
// //               <label htmlFor="user" className="block text-sm font-medium text-gray-700">
// //                 Select User
// //               </label>
// //               <select
// //                 id="user"
// //                 value={selectedUser?.id || ""}
// //                 onChange={(e) => {
// //                   const user = users.find(user => user.id === e.target.value)
// //                   setSelectedUser(user)
// //                 }}
// //                 required
// //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// //               >
// //                 <option value="" disabled>Select a user</option>
// //                 {users.map(user => (
// //                   <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="flex justify-end pt-4">
// //               <button
// //                 type="button"
// //                 onClick={onClose}
// //                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
// //               >
// //                 Cancel
// //               </button>

// //               <button
// //                 type="submit"
// //                 disabled={loading || !selectedUser}
// //                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
// //               >
// //                 {loading ? "Adding..." : "Add Member"}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default AddMemberModal







// "use client"

// import { useState, useEffect } from "react";
// import { useTeams } from "../contexts/TeamContext";
// import { db } from "../firebase";
// import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";

// function AddMemberModal({ isOpen, onClose, team }) {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { addMemberToTeam } = useTeams();

//   useEffect(() => {
//     if (!isOpen) return;

//     const fetchUsers = async () => {
//       try {
//         const usersCollection = collection(db, "users");
//         const userSnapshot = await getDocs(usersCollection);
//         const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setUsers(userList);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, [isOpen]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedUser || !team) return;

//     try {
//       setLoading(true);
//       await addMemberToTeam(team.id, selectedUser.id);
// console.log(selectedUser)
//       const teamRef = doc(db, "teams", team.id);
//       await updateDoc(teamRef, {
//         members: arrayUnion({ id: selectedUser.id, email: selectedUser.email, name: selectedUser.name })
//       });

//       setSelectedUser(null);
//       onClose();
//     } catch (error) {
//       console.error("Error adding member:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen || !team) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">Add Team Member</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <p className="mb-4 text-gray-600">
//             Select a user to add to <strong>{team.name}</strong>.
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="user" className="block text-sm font-medium text-gray-700">
//                 Select User
//               </label>
//               <select
//                 id="user"
//                 value={selectedUser?.id || ""}
//                 onChange={(e) => {
//                   const user = users.find(user => user.id === e.target.value);
//                   setSelectedUser(user);
//                 }}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="" disabled>Select a user</option>
//                 {users.map(user => (
//                   <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex justify-end pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={loading || !selectedUser}
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
//               >
//                 {loading ? "Adding..." : "Add Member"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddMemberModal;

// // 



"use client";

import { useState, useEffect } from "react";
import { useTeams } from "../contexts/TeamContext";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";

function AddMemberModal({ isOpen, onClose, team }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addMemberToTeam } = useTeams();

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched users:", userList); // Debugging
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !team || !selectedUser.id || !selectedUser.email || !selectedUser.displayName) {
      console.error("Invalid user selection:", selectedUser);
      return;
    }

    try {
      setLoading(true);
      console.log("Adding member:", selectedUser); // Debugging

      await addMemberToTeam(team.id, selectedUser.id);

      const teamRef = doc(db, "teams", team.id);
      await updateDoc(teamRef, {
        members: arrayUnion({
          id: selectedUser.id,
          email: selectedUser.email,
          name: selectedUser.displayName, // ✅ FIXED: Using displayName instead of name
        }),
      });

      setSelectedUser(null);
      onClose();
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add Team Member</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="mb-4 text-gray-600">
            Select a user to add to <strong>{team.name}</strong>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Select User
              </label>
              <select
                id="user"
                value={selectedUser ? selectedUser.id : ""}
                onChange={(e) => {
                  const userId = e.target.value;
                  const user = users.find((u) => u.id === userId);

                  if (user) {
                    console.log("User selected:", user); // Debugging
                    setSelectedUser(user);
                  } else {
                    console.warn("Selected user not found in list:", userId);
                    setSelectedUser(null);
                  }
                }}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select a user
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName} ({user.email}) 
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !selectedUser}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMemberModal;
