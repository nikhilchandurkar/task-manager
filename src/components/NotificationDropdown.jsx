"use client"

import { useState, useRef, useEffect } from "react"
import { useNotifications } from "../contexts/NotificationContext"

function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    // Handle navigation based on notification type if needed
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="sr-only">View notifications</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                  >
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.createdAt?.toDate ? notification.createdAt.toDate().toLocaleString() : "Just now"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown



// "use client"

// import { useState, useRef, useEffect } from "react"
// import { useNotifications } from "../contexts/NotificationContext"
// import { useAuth } from "../contexts/AuthContext"
// import { useTeams } from "../contexts/TeamContext"
// import { db } from "../firebase"
// import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore"

// function NotificationDropdown() {
//   const { currentUser } = useAuth()
//   const { teams } = useTeams()
//   const { 
//     notifications, 
//     unreadCount, 
//     markAsRead, 
//     markAllAsRead,
//     addNotification 
//   } = useNotifications()
//   const [isOpen, setIsOpen] = useState(false)
//   const dropdownRef = useRef(null)

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   // Listen for new task assignments to teams user is a member of
//   useEffect(() => {
//     if (!currentUser || !teams.length) return

//     // Get IDs of teams the user is a member of
//     const userTeamIds = teams
//       .filter(team => team.members.includes(currentUser.uid))
//       .map(team => team.id)
    
//     if (userTeamIds.length === 0) return

//     // Query for tasks assigned to user's teams
//     const tasksQuery = query(
//       collection(db, "tasks"),
//       where("teamId", "in", userTeamIds)
//     )

//     const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         const task = { id: change.doc.id, ...change.doc.data() }
//         const team = teams.find(t => t.id === task.teamId)
//         const teamName = team ? team.name : "your team"
        
//         // If a new task is assigned to a team
//         if (change.type === "added" || change.type === "modified") {
//           // Check if this is a newly created task (within last hour)
//           const isRecentlyCreated = task.createdAt && 
//             (task.createdAt.toDate().getTime() > Date.now() - 3600000)
          
//           if (isRecentlyCreated) {
//             addNotification({
//               id: `task-assigned-${task.id}`,
//               type: "task-assigned",
//               message: `New task for ${teamName}: ${task.title}`,
//               taskId: task.id,
//               teamId: task.teamId,
//               read: false,
//               createdAt: Timestamp.now()
//             })
//           }
          
//           // Check if due date is approaching (within 24 hours)
//           if (task.dueDate) {
//             const dueDate = task.dueDate.toDate()
//             const hoursUntilDue = (dueDate.getTime() - Date.now()) / 3600000
            
//             if (hoursUntilDue > 0 && hoursUntilDue < 24) {
//               addNotification({
//                 id: `task-due-${task.id}`,
//                 type: "task-due",
//                 message: `Task due soon for ${teamName}: ${task.title} (${dueDate.toLocaleString()})`,
//                 taskId: task.id,
//                 teamId: task.teamId,
//                 read: false,
//                 createdAt: Timestamp.now()
//               })
//             }
//           }
//         }
//       })
//     })

//     return () => unsubscribe()
//   }, [currentUser, teams, addNotification])

//   const handleNotificationClick = (notification) => {
//     if (!notification.read) {
//       markAsRead(notification.id)
//     }
    
//     // Handle navigation based on notification type
//     if (notification.taskId) {
//       // Navigate to the task detail page or highlight the task
//       // You can implement the navigation logic here
//       console.log(`Navigate to task: ${notification.taskId} in team: ${notification.teamId}`)
      
//       // Example: router.push(`/teams/${notification.teamId}/tasks/${notification.taskId}`)
//     }
//   }

//   // Get notification icon based on type
//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case "task-assigned":
//         return (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//           </svg>
//         )
//       case "task-due":
//         return (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         )
//       default:
//         return (
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         )
//     }
//   }

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//       >
//         <span className="sr-only">View notifications</span>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//           />
//         </svg>
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
//           <div className="py-1">
//             <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
//               {unreadCount > 0 && (
//                 <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">
//                   Mark all as read
//                 </button>
//               )}
//             </div>

//             <div className="max-h-60 overflow-y-auto">
//               {notifications.length === 0 ? (
//                 <div className="px-4 py-6 text-center text-gray-500">No notifications</div>
//               ) : (
//                 notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     onClick={() => handleNotificationClick(notification)}
//                     className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
//                   >
//                     <div className="flex items-start">
//                       {getNotificationIcon(notification.type)}
//                       <div>
//                         <p className="text-sm text-gray-900">{notification.message}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {notification.createdAt?.toDate ? notification.createdAt.toDate().toLocaleString() : "Just now"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default NotificationDropdown