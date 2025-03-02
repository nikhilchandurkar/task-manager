



// import { useState, useEffect } from "react";
// import { ref, push, set, get } from "firebase/database";
// import { useAuth } from "../contexts/AuthContext";
// import { db } from "../firebase";

// function CreateTeamModal({ isOpen, onClose }) {
//   const [teamName, setTeamName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [users, setUsers] = useState([]);  // List of users
//   const [selectedUsers, setSelectedUsers] = useState([]); // Selected team members

//   const { currentUser } = useAuth();

//   // Fetch users from Realtime Database
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const usersRef = ref(db, "users");
//         const snapshot = await get(usersRef);
//         if (snapshot.exists()) {
//           setUsers(Object.values(snapshot.val()));
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     if (isOpen) fetchUsers();
//   }, [isOpen]);

//   const handleSelectUser = (uid) => {
//     setSelectedUsers((prev) =>
//       prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!teamName.trim() || !currentUser) return;

//     try {
//       setLoading(true);
      
//       const newTeamRef = push(ref(db, "teams"));
//       console.log("Creating team:", newTeamRef);

//       const teamMembers = { [currentUser.uid]: true };
//       selectedUsers.forEach(uid => (teamMembers[uid] = true));

//       await set(newTeamRef, {
//         id: newTeamRef.key,
//         name: teamName.trim(),
//         createdBy: currentUser.uid,
//         members: teamMembers,
//         createdAt: Date.now(),
//       });

//       console.log("Team created successfully!");
//       setTeamName("");
//       setSelectedUsers([]);
//       onClose();
//     } catch (error) {
//       console.error("Error creating team:", error);
//       alert("Failed to create team. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">Create Team</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
//                 Team Name
//               </label>
//               <input
//                 type="text"
//                 id="teamName"
//                 value={teamName}
//                 onChange={(e) => setTeamName(e.target.value)}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//                 placeholder="Enter team name"
//               />
//             </div>

//             {/* User Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Select Members:</label>
//               <div className="mt-2">
//                 {users.length > 0 ? (
//                   users.map((user) => (
//                     <div key={user.uid} className="flex items-center space-x-2">
//                       <input
//                         type="checkbox"
//                         id={user.uid}
//                         checked={selectedUsers.includes(user.uid)}
//                         onChange={() => handleSelectUser(user.uid)}
//                       />
//                       <label htmlFor={user.uid} className="text-sm">{user.username || user.email}</label>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">No users available</p>
//                 )}
//               </div>
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
//                 disabled={loading || !teamName.trim()}
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
//               >
//                 {loading ? "Creating..." : "Create Team"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateTeamModal;




import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

function CreateTeamModal({ isOpen, onClose }) {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { currentUser } = useAuth();

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen]);

  const handleSelectUser = (uid) => {
    setSelectedUsers((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || !currentUser) return;

    try {
      setLoading(true);
      
      const teamMembers = { [currentUser.uid]: true };
      selectedUsers.forEach(uid => (teamMembers[uid] = true));

      await addDoc(collection(db, "teams"), {
        name: teamName.trim(),
        createdBy: currentUser.uid,
        members: teamMembers,
        createdAt: serverTimestamp(),
      });

      console.log("Team created successfully!");
      setTeamName("");
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create Team</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter team name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Members:</label>
              <div className="mt-2">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={user.id}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                      <label htmlFor={user.id} className="text-sm">{user.username || user.email}</label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No users available</p>
                )}
              </div>
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
                disabled={loading || !teamName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTeamModal;
