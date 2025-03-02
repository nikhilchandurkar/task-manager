// // import { useDrop } from "react-dnd"
// // import { useTasks } from "../contexts/TaskContext"
// // import TaskCard from "./TaskCard"

// // const COLUMNS = [
// //   { id: "todo", title: "To Do", color: "bg-gray-100" },
// //   { id: "inprogress", title: "In Progress", color: "bg-blue-50" },
// //   { id: "done", title: "Done", color: "bg-green-50" },
// // ]

// // function KanbanColumn({ id, title, color, tasks, onEditTask }) {
// //   const { moveTask } = useTasks()

// //   const [{ isOver }, drop] = useDrop({
// //     accept: "task",
// //     drop: (item) => {
// //       if (item.status !== id) {
// //         moveTask(item.id, id)
// //       }
// //     },
// //     collect: (monitor) => ({
// //       isOver: !!monitor.isOver(),
// //     }),
// //   })

// //   return (
// //     <div ref={drop} className={`flex-1 min-h-[500px] rounded-lg p-4 ${color} ${isOver ? "ring-2 ring-blue-500" : ""}`}>
// //       <h3 className="font-medium text-lg mb-4">{title}</h3>
// //       <div className="space-y-3">
// //         {tasks.map((task) => (
// //           <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
// //         ))}

// //         {tasks.length === 0 && <div className="text-center py-8 text-gray-500 italic">No tasks</div>}
// //       </div>
// //     </div>
// //   )
// // }

// // function KanbanBoard({ onEditTask }) {
// //   const { tasks, loading } = useTasks()

// //   if (loading) {
// //     return <div className="text-center py-8">Loading tasks...</div>
// //   }

// //   // Group tasks by status
// //   const tasksByStatus = {
// //     todo: tasks.filter((task) => task.status === "todo"),
// //     inprogress: tasks.filter((task) => task.status === "inprogress"),
// //     done: tasks.filter((task) => task.status === "done"),
// //   }

// //   return (
// //     <div className="flex flex-col md:flex-row gap-4">
// //       {COLUMNS.map((column) => (
// //         <KanbanColumn
// //           key={column.id}
// //           id={column.id}
// //           title={column.title}
// //           color={column.color}
// //           tasks={tasksByStatus[column.id] || []}
// //           onEditTask={onEditTask}
// //         />
// //       ))}
// //     </div>
// //   )
// // }

// // export default KanbanBoard




// import React from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { useTasks } from "../contexts/TaskContext";

// // First, let's fix the TaskCard component since it's missing the drag functionality
// function TaskCard({ task, onEdit }) {
//   const [{ isDragging }, drag] = useDrag({
//     type: "task",
//     item: { id: task.id, status: task.status },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   });

//   return (
//     <div
//       ref={drag}
//       className={`bg-white p-3 rounded shadow cursor-move ${
//         isDragging ? 'opacity-50' : ''
//       }`}
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//     >
//       <div className="flex justify-between">
//         <h4 className="font-medium">{task.title}</h4>
//         <button 
//           onClick={onEdit}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           Edit
//         </button>
//       </div>
//       {console.log(task)}
//       {task.description && (
//         <p className="text-sm text-gray-600 mt-1">{task.description}</p>
//       )}
//     </div>
//   );
// }

// const COLUMNS = [
//   { id: "todo", title: "To Do", color: "bg-gray-100" },
//   { id: "inprogress", title: "In Progress", color: "bg-blue-50" },
//   { id: "done", title: "Done", color: "bg-green-50" },
// ];

// function KanbanColumn({ id, title, color, tasks, onEditTask }) {
//   const { moveTask } = useTasks();

//   const [{ isOver }, drop] = useDrop({
//     accept: "task",
//     drop: (item) => {
//       if (item.status !== id) {
//         moveTask(item.id, id);
//       }
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   });

//   return (
//     <div 
//       ref={drop} 
//       className={`flex-1 min-h-[500px] rounded-lg p-4 ${color} ${isOver ? "ring-2 ring-blue-500" : ""}`}
//     >
//       <h3 className="font-medium text-lg mb-4">{title}</h3>
//       <div className="space-y-3">
//         {tasks && tasks.map((task) => (
//           <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
//         ))}
        
//         {(!tasks || tasks.length === 0) && (
//           <div className="text-center py-8 text-gray-500 italic">No tasks</div>
//         )}
//       </div>
//     </div>
//   );
// }

// function KanbanBoard({ onEditTask }) {
//   const { tasks, loading } = useTasks();

//   if (loading) {
//     return <div className="text-center py-8">Loading tasks...</div>;
//   }

//   // Add a safety check for tasks
//   if (!tasks || !Array.isArray(tasks)) {
//     console.error("Tasks is not an array:", tasks);
//     return <div className="text-center py-8 text-red-500">Error loading tasks</div>;
//   }

//   // Group tasks by status
//   const tasksByStatus = {
//     todo: tasks.filter((task) => task.status === "todo"),
//     inprogress: tasks.filter((task) => task.status === "inprogress"),
//     done: tasks.filter((task) => task.status === "done"),
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="flex flex-col md:flex-row gap-4">
//         {COLUMNS.map((column) => (
//           <KanbanColumn
//             key={column.id}
//             id={column.id}
//             title={column.title}
//             color={column.color}
//             tasks={tasksByStatus[column.id] || []}
//             onEditTask={onEditTask}
//           />
//         ))}
//       </div>
//     </DndProvider>
//   );
// }

// export default KanbanBoard;





import React, { useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTasks } from "../contexts/TaskContext";
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; 
import { toast } from 'react-toastify'; 

function TaskCard({ task, onEdit }) {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white p-3 rounded shadow cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex justify-between">
        <h4 className="font-medium">{task.title}</h4>
        <button 
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-700"
        >
          Edit
        </button>
      </div>
      {task.description && (
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      )}
      <div className="mt-2 flex justify-between items-center text-xs">
        <span className="text-gray-500">
          {task.assignedTo ? `Assigned to: ${task.assignedTo}` : 'Unassigned'}
        </span>
        <span className={`px-2 py-1 rounded-full ${
          task.priority === 'high' ? 'bg-red-100 text-red-800' :
          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {task.priority || 'normal'}
        </span>
      </div>
    </div>
  );
}

const COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "inprogress", title: "In Progress", color: "bg-blue-50" },
  { id: "done", title: "Done", color: "bg-green-50" },
];

function KanbanColumn({ id, title, color, tasks, onEditTask }) {
  const { moveTask } = useTasks();

  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item) => {
      if (item.status !== id) {
        moveTask(item.id, id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop} 
      className={`flex-1 min-h-[500px] rounded-lg p-4 ${color} ${isOver ? "ring-2 ring-blue-500" : ""}`}
    >
      <h3 className="font-medium text-lg mb-4">{title}</h3>
      <div className="space-y-3">
        {tasks && tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
        ))}
        
        {(!tasks || tasks.length === 0) && (
          <div className="text-center py-8 text-gray-500 italic">No tasks</div>
        )}
      </div>
    </div>
  );
}

const enhancedMoveTask = async (taskId, newStatus, currentUser) => {
  // Reference to the task document in Firestore
  const taskRef = doc(db, "tasks", taskId);
  
  // Update the task in Firestore
  try {
    await updateDoc(taskRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
      updatedBy: currentUser?.uid || 'system',
      statusChangeHistory: arrayUnion({
        status: newStatus,
        timestamp: new Date(),
        changedBy: currentUser?.displayName || currentUser?.email || 'Unknown user'
      })
    });
    // Show notification to the current user
    toast.success(`Task moved to ${newStatus}`);

    // Create notification for admin and assignee
    createStatusChangeNotification(taskId, newStatus, currentUser);
    return true;
  } catch (error) {
    console.error("Error updating task status:", error);
    toast.error("Failed to update task status");
    return false;
  }
};

// Function to create notifications in Firestore
const createStatusChangeNotification = async (taskId, newStatus, currentUser) => {
  try {
    // First, get the task details to know who it's assigned to
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    const taskData = taskDoc.data();
    
    if (!taskData) return;
    
    // Create notification for admin
    await addDoc(collection(db, "notifications"), {
      type: "status_change",
      taskId: taskId,
      taskTitle: taskData.title,
      oldStatus: taskData.status,
      newStatus: newStatus,
      createdAt: serverTimestamp(),
      forUser: "admin", // Special recipient for admin notifications
      read: false,
      message: `Task "${taskData.title}" was moved to ${newStatus} by ${currentUser?.displayName || currentUser?.email || 'Unknown user'}`
    });
    
    // If the task is assigned to someone, create notification for them too
    if (taskData.assignedTo && taskData.assignedToId !== currentUser?.uid) {
      await addDoc(collection(db, "notifications"), {
        type: "status_change",
        taskId: taskId,
        taskTitle: taskData.title,
        oldStatus: taskData.status,
        newStatus: newStatus,
        createdAt: serverTimestamp(),
        forUser: taskData.assignedToId, // Send to the assigned user
        read: false,
        message: `Your task "${taskData.title}" was moved to ${newStatus} by ${currentUser?.displayName || currentUser?.email || 'Unknown user'}`
      });
    }
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
};

function KanbanBoard({ onEditTask }) {
  const { tasks, loading, currentUser } = useTasks();
  
  // Setup notification listeners
  useEffect(() => {
    if (!currentUser) return;
    
    // Setup a listener for notifications addressed to this user
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("forUser", "==", currentUser.uid),
      where("read", "==", false),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // New notification - show it to the user
          const notification = change.doc.data();
          toast.info(notification.message, {
            onClick: () => markNotificationAsRead(change.doc.id)
          });
        }
      });
    });
    
    return () => unsubscribe();
  }, [currentUser]);
  
  // Function to mark notifications as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  // Add a safety check for tasks
  if (!tasks || !Array.isArray(tasks)) {
    console.error("Tasks is not an array:", tasks);
    return <div className="text-center py-8 text-red-500">Error loading tasks</div>;
  }

  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter((task) => task.status === "todo"),
    inprogress: tasks.filter((task) => task.status === "inprogress"),
    done: tasks.filter((task) => task.status === "done"),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col md:flex-row gap-4">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={tasksByStatus[column.id] || []}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;