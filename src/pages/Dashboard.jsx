







// "use client"

// import { useState, useEffect, Suspense, lazy } from "react"
// import { DndProvider } from "react-dnd"
// import { HTML5Backend } from "react-dnd-html5-backend"
// import { useAuth } from "../contexts/AuthContext"
// import { TaskProvider } from "../contexts/TaskContext"
// import { TeamProvider } from "../contexts/TeamContext"
// import { NotificationProvider } from "../contexts/NotificationContext"
// import Navbar from "../components/Navbar"
// import { db } from "../firebase"
// import { collection, getDocs } from "firebase/firestore"

// const KanbanBoard = lazy(() => import("../components/KanbanBoard"))

// function DashboardContent() {
//   const { currentUser } = useAuth()
//   const [tasks, setTasks] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     // Don't fetch if no user is logged in
//     if (!currentUser) {
//       setLoading(false)
//       return
//     }
    
//     let isMounted = true
    
//     const fetchTasks = async () => {
//       setLoading(true)
//       setError(null)
      
//       try {
//         console.log("Fetching tasks for user:", currentUser.uid)
        
//         // Get tasks collection reference
//         const tasksCollectionRef = collection(db, "tasks")
        
//         // Fetch the data
//         const taskSnapshot = await getDocs(tasksCollectionRef)
        
//         // Don't update state if component unmounted
//         if (!isMounted) return
        
//         // Transform the data
//         const tasksData = taskSnapshot.docs.map(doc => ({ 
//           id: doc.id, 
//           ...doc.data() 
//         }))
        
//         console.log("Successfully fetched tasks:", tasksData)
//         setTasks(tasksData)
//       } catch (error) {
//         console.error("Error fetching tasks:", error)
        
//         if (isMounted) {
//           setError("Failed to load tasks. Please try again later.")
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false)
//         }
//       }
//     }
    
//     fetchTasks()
    
//     // Cleanup function
//     return () => {
//       isMounted = false
//     }
//   }, [currentUser])

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="container mx-auto px-4 py-6">
//         <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
//         <div className="bg-white shadow rounded-lg p-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           )}
          
//           {loading ? (
//             <div className="flex justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
//             </div>
//           ) : tasks.length === 0 ? (
//             <p className="text-gray-500 py-4 text-center">No tasks available.</p>
//           ) : (
//             <DndProvider backend={HTML5Backend}>
//               <Suspense fallback={
//                 <div className="flex justify-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
//                 </div>
//               }>
//                 <KanbanBoard tasks={tasks} />
//               </Suspense>
//             </DndProvider>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// function Dashboard() {
//   return (
//     <TeamProvider>
//       <TaskProvider>
//         <NotificationProvider>
//           <DashboardContent />
//         </NotificationProvider>
//       </TaskProvider>
//     </TeamProvider>
//   )
// }

// export default Dashboard



"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAuth } from "../contexts/AuthContext";
import { TaskProvider } from "../contexts/TaskContext";
import { TeamProvider } from "../contexts/TeamContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const KanbanBoard = lazy(() => import("../components/KanbanBoard"));

function DashboardContent() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log("Fetching tasks for user:", currentUser.uid);

    const tasksCollectionRef = collection(db, "tasks");
    const tasksQuery = query(tasksCollectionRef,
       where("createdBy", "==", currentUser.uid || "createdBy", "==", currentUser.uid)
      );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Successfully fetched tasks:", tasksData);
        setTasks(tasksData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setError(error.message || "Failed to load tasks. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <div className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">No tasks available.</p>
          ) : (
            <DndProvider backend={HTML5Backend}>
              <Suspense
                fallback={
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                  </div>
                }
              >
                <KanbanBoard tasks={tasks} />
              </Suspense>
            </DndProvider>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <TeamProvider>
      <TaskProvider>
        <NotificationProvider>
          <DashboardContent />
        </NotificationProvider>
      </TaskProvider>
    </TeamProvider>
  );
}

export default Dashboard;
