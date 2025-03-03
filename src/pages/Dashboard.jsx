



// // "use client";

// // import { useState, useEffect, Suspense, lazy } from "react";
// // import { DndProvider } from "react-dnd";
// // import { HTML5Backend } from "react-dnd-html5-backend";
// // import { useAuth } from "../contexts/AuthContext";
// // import { TaskProvider } from "../contexts/TaskContext";
// // import { TeamProvider } from "../contexts/TeamContext";
// // import { NotificationProvider } from "../contexts/NotificationContext";
// // import Navbar from "../components/Navbar";
// // import { db } from "../firebase";
// // import { collection, query, where, onSnapshot } from "firebase/firestore";

// // const KanbanBoard = lazy(() => import("../components/KanbanBoard"));

// // function DashboardContent() {
// //   const { currentUser } = useAuth();
// //   const [tasks, setTasks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     if (!currentUser) {
// //       setLoading(false);
// //       return;
// //     }

// //     console.log("Fetching tasks for user:", currentUser.uid);

// //     const tasksCollectionRef = collection(db, "tasks");
// //     const tasksQuery = query(tasksCollectionRef,
// //       //  where("createdBy", "==", currentUser.uid || "createdBy", "==", currentUser.uid)
// //       );

// //     const unsubscribe = onSnapshot(
// //       tasksQuery,
// //       (snapshot) => {
// //         const tasksData = snapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));

// //         console.log("Successfully fetched tasks:", tasksData);
// //         setTasks(tasksData);
// //         setLoading(false);
// //       },
// //       (error) => {
// //         console.error("Error fetching tasks:", error);
// //         setError(error.message || "Failed to load tasks. Please try again later.");
// //         setLoading(false);
// //       }
// //     );

// //     return () => unsubscribe();
// //   }, [currentUser]);

// //   return (
// //     <div className="min-h-screen bg-gray-100">
// //       <Navbar />
// //       <div className="container mx-auto px-4 py-6">
// //         <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
// //         <div className="bg-white shadow rounded-lg p-6">
// //           {error && (
// //             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
// //               {error}
// //             </div>
// //           )}

// //           {loading ? (
// //             <div className="flex justify-center py-8">
// //               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
// //             </div>
// //           ) : tasks.length === 0 ? (
// //             <p className="text-gray-500 py-4 text-center">No tasks available.</p>
// //           ) : (
// //             <DndProvider backend={HTML5Backend}>
// //               <Suspense
// //                 fallback={
// //                   <div className="flex justify-center py-8">
// //                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
// //                   </div>
// //                 }
// //               >
// //                 <KanbanBoard tasks={tasks} />
// //               </Suspense>
// //             </DndProvider>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function Dashboard() {
// //   return (
// //     <TeamProvider>
// //       <TaskProvider>
// //         <NotificationProvider>
// //           <DashboardContent />
// //         </NotificationProvider>
// //       </TaskProvider>
// //     </TeamProvider>
// //   );
// // }

// // export default Dashboard;



// // "use client";

// // import { useState, useEffect } from "react";
// // import { useAuth } from "../contexts/AuthContext";
// // import { db } from "../firebase";
// // import { collection, query, onSnapshot, updateDoc, doc } from "firebase/firestore";

// // function DashboardContent() {
// //   const { currentUser } = useAuth();
// //   const [tasks, setTasks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     if (!currentUser) {
// //       setLoading(false);
// //       return;
// //     }

// //     console.log("Fetching tasks for user:", currentUser.uid);

// //     const tasksCollectionRef = collection(db, "tasks");
// //     const tasksQuery = query(tasksCollectionRef);

// //     const unsubscribe = onSnapshot(
// //       tasksQuery,
// //       (snapshot) => {
// //         const tasksData = snapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));

// //         console.log("Successfully fetched tasks:", tasksData);
// //         setTasks(tasksData);
// //         setLoading(false);
// //       },
// //       (error) => {
// //         console.error("Error fetching tasks:", error);
// //         setError(error.message || "Failed to load tasks. Please try again later.");
// //         setLoading(false);
// //       }
// //     );

// //     return () => unsubscribe();
// //   }, [currentUser]);

// //   const updateTaskStatus = async (taskId, newStatus) => {
// //     try {
// //       const taskRef = doc(db, "tasks", taskId);
// //       await updateDoc(taskRef, { status: newStatus });
// //       console.log("Task status updated");
// //     } catch (error) {
// //       console.error("Error updating task status:", error);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-6">
// //       <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
// //       <div className="bg-white shadow rounded-lg p-6 mt-4">
// //         {error && (
// //           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
// //             {error}
// //           </div>
// //         )}

// //         {loading ? (
// //           <div className="flex justify-center py-8">
// //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
// //           </div>
// //         ) : tasks.length === 0 ? (
// //           <p className="text-gray-500 py-4 text-center">No tasks available.</p>
// //         ) : (
// //           <ul className="space-y-4">
// //             {tasks.map((task) => (
// //               <li key={task.id} className="p-4 bg-gray-50 rounded-lg shadow">
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-lg font-semibold">{task.title}</span>
// //                   <button
// //                     onClick={() => updateTaskStatus(task.id, task.status === "pending" ? "completed" : "pending")}
// //                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //                   >
// //                     {task.status === "pending" ? "Mark as Completed" : "Mark as Pending"}
// //                   </button>
// //                 </div>
// //               </li>
// //             ))}
// //           </ul>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default DashboardContent;






// // "use client";

// // import { useState, useEffect } from "react";
// // import { useAuth } from "../contexts/AuthContext";
// // import { db } from "../firebase";
// // import { collection, query, onSnapshot, updateDoc, doc } from "firebase/firestore";
// // import Navbar from "../components/Navbar"; // Ensure Navbar is correctly imported

// // function DashboardContent() {
// //   const { currentUser } = useAuth();
// //   const [tasks, setTasks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     if (!currentUser) {
// //       setLoading(false);
// //       return;
// //     }

// //     console.log("Fetching tasks for user:", currentUser.uid);

// //     const tasksCollectionRef = collection(db, "tasks");
// //     const tasksQuery = query(tasksCollectionRef);

// //     const unsubscribe = onSnapshot(
// //       tasksQuery,
// //       (snapshot) => {
// //         const tasksData = snapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));

// //         console.log("Successfully fetched tasks:", tasksData);
// //         setTasks(tasksData);
// //         setLoading(false);
// //       },
// //       (error) => {
// //         console.error("Error fetching tasks:", error);
// //         setError(error.message || "Failed to load tasks. Please try again later.");
// //         setLoading(false);
// //       }
// //     );

// //     return () => unsubscribe();
// //   }, [currentUser]);

// //   const updateTaskStatus = async (taskId, newStatus) => {
// //     try {
// //       // Optimistically update state
// //       setTasks((prevTasks) =>
// //         prevTasks.map((task) =>
// //           task.id === taskId ? { ...task, status: newStatus } : task
// //         )
// //       );

// //       const taskRef = doc(db, "tasks", taskId);
// //       await updateDoc(taskRef, { status: newStatus });
// //       console.log("Task status updated");
// //     } catch (error) {
// //       console.error("Error updating task status:", error);
// //     }
// //   };

// //   return (
// //     <>
// //       <Navbar /> {/* Ensure Navbar is rendered */}
// //       <div className="min-h-screen bg-gray-100 p-6">
// //         <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
// //         <div className="bg-white shadow rounded-lg p-6 mt-4">
// //           {error && (
// //             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
// //               {error}
// //             </div>
// //           )}

// //           {loading ? (
// //             <div className="flex justify-center py-8">
// //               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
// //             </div>
// //           ) : tasks.length === 0 ? (
// //             <p className="text-gray-500 py-4 text-center">No tasks available.</p>
// //           ) : (
// //             <ul className="space-y-4">
// //               {tasks.map((task) => (
// //                 <li key={task.id} className="p-4 bg-gray-50 rounded-lg shadow">
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-lg font-semibold">{task.title}</span>
// //                     <button
// //                       onClick={() => updateTaskStatus(task.id, task.status === "pending" ? "completed" : "pending")}
// //                       className={`px-4 py-2 rounded-lg ${
// //                         task.status === "pending" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
// //                       } text-white`}
// //                     >
// //                       {task.status === "pending" ? "Mark as Completed" : "Mark as Pending"}
// //                     </button>
// //                   </div>
// //                 </li>
// //               ))}
// //             </ul>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // export default DashboardContent;







// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { db } from "../firebase";
// import { collection, query, onSnapshot, updateDoc, doc } from "firebase/firestore";
// import Navbar from "../components/Navbar"; 

// function DashboardContent() {
//   const { currentUser } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedTask, setExpandedTask] = useState(null); // Track which task is expanded

//   useEffect(() => {
//     if (!currentUser) {
//       setLoading(false);
//       return;
//     }

//     console.log("Fetching tasks for user:", currentUser.uid);

//     const tasksCollectionRef = collection(db, "tasks");
//     const tasksQuery = query(tasksCollectionRef);

//     const unsubscribe = onSnapshot(
//       tasksQuery,
//       (snapshot) => {
//         const tasksData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         console.log("Successfully fetched tasks:", tasksData);
//         setTasks(tasksData);
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Error fetching tasks:", error);
//         setError(error.message || "Failed to load tasks. Please try again later.");
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [currentUser]);

//   const updateTaskStatus = async (taskId, newStatus) => {
//     try {
//       setTasks((prevTasks) =>
//         prevTasks.map((task) =>
//           task.id === taskId ? { ...task, status: newStatus } : task
//         )
//       );

//       const taskRef = doc(db, "tasks", taskId);
//       await updateDoc(taskRef, { status: newStatus });
//       console.log("Task status updated");
//     } catch (error) {
//       console.error("Error updating task status:", error);
//     }
//   };

//   const toggleTaskDetails = (taskId) => {
//     setExpandedTask(expandedTask === taskId ? null : taskId);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-100 p-6">
//         <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
//         <div className="bg-white shadow rounded-lg p-6 mt-4">
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
//             <ul className="space-y-4">
//               {tasks.map((task) => (
//                 <li key={task.id} className="p-4 bg-gray-50 rounded-lg shadow">
//                   <div className="flex justify-between items-center">
//                     <button
//                       onClick={() => toggleTaskDetails(task.id)}
//                       className="text-lg font-semibold text-left w-full focus:outline-none"
//                     >
//                       {task.title}
//                     </button>
//                     <button
//                       onClick={() => updateTaskStatus(task.id, task.status === "pending" ? "completed" : "pending")}
//                       className={`px-4 py-2 rounded-lg ${
//                         task.status === "pending" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
//                       } text-white`}
//                     >
//                       {task.status === "pending" ? "Mark as Completed" : "Mark as Pending"}
//                     </button>
//                   </div>

//                   {/* Show task details when clicked */}
//                   {expandedTask === task.id && (
//                     <div className="mt-3 bg-gray-200 p-3 rounded-lg">
//                       <p className="text-sm text-gray-700"><strong>Description:</strong> {task.description || "No description available."}</p>
//                       <p className="text-sm text-gray-700 mt-1"><strong>Due Date:</strong> {task.dueDate || "No due date set."}</p>
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default DashboardContent;
  









"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, query, onSnapshot, updateDoc, doc } from "firebase/firestore";
import Navbar from "../components/Navbar"; 

function DashboardContent() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null); 

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log("Fetching tasks for user:", currentUser.uid);

    const tasksCollectionRef = collection(db, "tasks");
    const tasksQuery = query(tasksCollectionRef);

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

  const updateTaskStatus = async (taskId, currentStatus) => {
    if (currentStatus === "completed") return; // Prevent reverting

    try {
      const newStatus = "completed";

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });

      console.log("Task marked as completed");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <div className="bg-white shadow rounded-lg p-6 mt-4">
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
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li key={task.id} className="p-4 bg-gray-50 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleTaskDetails(task.id)}
                      className="text-lg font-semibold text-left w-full focus:outline-none"
                    >
                      {task.title}
                    </button>

                    <span className="text-gray-700 font-medium">{task.assignTo}</span>

                    <button
                      onClick={() => updateTaskStatus(task.id, task.status)}
                      disabled={task.status === "completed"}
                      className={`px-4 py-2 rounded-lg ${
                        task.status === "pending"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {task.status === "pending" ? "Mark as Completed" : "Completed"}
                    </button>
                  </div>

                  {expandedTask === task.id && (
                    <div className="mt-3 bg-gray-200 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Description:</strong> {task.description || "No description available."}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Due Date:</strong> {task.dueDate || "No due date set."}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Priority:</strong> {task.priority || "Not specified"}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardContent;
