// // // import { useState, useEffect } from "react";
// // // import { db } from "../firebase";
// // // import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";

// // // function CreateTask() {
// // //   const [title, setTitle] = useState("");
// // //   const [description, setDescription] = useState("");
// // //   const [assignedTo, setAssignedTo] = useState("");
// // //   const [priority, setPriority] = useState("medium");
// // //   const [dueDate, setDueDate] = useState("");
// // //   const [users, setUsers] = useState([]);
// // //   const [teams, setTeams] = useState([]);

// // //   useEffect(() => {
// // //     const fetchUsersAndTeams = async () => {
// // //       try {
// // //         const usersSnapshot = await getDocs(collection(db, "users"));
// // //         const teamsSnapshot = await getDocs(collection(db, "teams"));
        
// // //         setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// // //         setTeams(teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
// // //       } catch (error) {
// // //         console.error("Error fetching users or teams:", error);
// // //       }
// // //     };

// // //     fetchUsersAndTeams();
// // //   }, []);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     if (!title.trim()) {
// // //       alert("Task title is required.");
// // //       return;
// // //     }

// // //     const newTask = {
// // //       title,
// // //       description,
// // //       assignedTo: assignedTo || null,
// // //       priority,
// // //       dueDate: dueDate ? new Date(dueDate).toISOString() : null,
// // //       status: "todo",
// // //       createdAt: serverTimestamp(),
// // //     };

// // //     try {
// // //       await addDoc(collection(db, "tasks"), newTask);
// // //       setTitle("");
// // //       setDescription("");
// // //       setAssignedTo("");
// // //       setPriority("medium");
// // //       setDueDate("");
// // //       alert("Task created successfully!");
// // //     } catch (error) {
// // //       console.error("Error creating task:", error);
// // //       alert("Failed to create task.");
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-4 bg-white shadow-md rounded-lg">
// // //       <h2 className="text-lg font-bold mb-4">Create New Task</h2>
// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           placeholder="Task Title"
// // //           value={title}
// // //           onChange={(e) => setTitle(e.target.value)}
// // //           className="w-full p-2 border rounded-md"
// // //           required
// // //         />
// // //         <textarea
// // //           placeholder="Task Description"
// // //           value={description}
// // //           onChange={(e) => setDescription(e.target.value)}
// // //           className="w-full p-2 border rounded-md"
// // //         />
// // //         <select
// // //           value={priority}
// // //           onChange={(e) => setPriority(e.target.value)}
// // //           className="w-full p-2 border rounded-md"
// // //         >
// // //           <option value="low">Low Priority</option>
// // //           <option value="medium">Medium Priority</option>
// // //           <option value="high">High Priority</option>
// // //         </select>
// // //         <input
// // //           type="date"
// // //           value={dueDate}
// // //           onChange={(e) => setDueDate(e.target.value)}
// // //           className="w-full p-2 border rounded-md"
// // //         />
// // //         <select
// // //           value={assignedTo}
// // //           onChange={(e) => setAssignedTo(e.target.value)}
// // //           className="w-full p-2 border rounded-md"
// // //         >
// // //           <option value="">Assign to...</option>
// // //           {users.map((user) => (
// // //             <option key={user.id} value={user.id}>{user.displayName}</option>
// // //           ))}
// // //         </select>
// // //         <button
// // //           type="submit"
// // //           className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
// // //         >
// // //           Create Task
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }

// // // export default CreateTask;




// // import { useState, useEffect } from "react";
// // import { db } from "../firebase";
// // import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

// // function CreateTask() {
// //   const [title, setTitle] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [assignedTeam, setAssignedTeam] = useState("");
// //   const [priority, setPriority] = useState("medium");
// //   const [dueDate, setDueDate] = useState("");
// //   const [teams, setTeams] = useState([]);

// //   useEffect(() => {
// //     const fetchTeams = async () => {
// //       try {
// //         console.log("Fetching teams...");
// //         const teamsSnapshot = await getDocs(collection(db, "teams"));
// //         const teamsData = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// //         console.log("Fetched teams:", teamsData);
// //         setTeams(teamsData);
// //       } catch (error) {
// //         console.error("Error fetching teams:", error);
// //       }
// //     };

// //     fetchTeams();
// //   }, []);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!title.trim()) {
// //       alert("Task title is required.");
// //       return;
// //     }
// //     if (!assignedTeam) {
// //       alert("Please assign the task to a team.");
// //       return;
// //     }

// //     const newTask = {
// //       title,
// //       description,
// //       assignedTo: assignedTeam,
// //       priority,
// //       dueDate: dueDate ? new Date(dueDate).toISOString() : null,
// //       status: "todo",
// //       createdAt: serverTimestamp(),
// //     };

// //     try {
// //       await addDoc(collection(db, "tasks"), newTask);
// //       setTitle("");
// //       setDescription("");
// //       setAssignedTeam("");
// //       setPriority("medium");
// //       setDueDate("");
// //       alert("Task created successfully!");
// //     } catch (error) {
// //       console.error("Error creating task:", error);
// //       alert("Failed to create task.");
// //     }
// //   };

// //   return (
// //     <div className="p-4 bg-white shadow-md rounded-lg">
// //       <h2 className="text-lg font-bold mb-4">Create New Task</h2>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input
// //           type="text"
// //           placeholder="Task Title"
// //           value={title}
// //           onChange={(e) => setTitle(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //           required
// //         />
// //         <textarea
// //           placeholder="Task Description"
// //           value={description}
// //           onChange={(e) => setDescription(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //         />
// //         <select
// //           value={priority}
// //           onChange={(e) => setPriority(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //         >
// //           <option value="low">Low Priority</option>
// //           <option value="medium">Medium Priority</option>
// //           <option value="high">High Priority</option>
// //         </select>
// //         <input
// //           type="date"
// //           value={dueDate}
// //           onChange={(e) => setDueDate(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //         />
// //         <select
// //           value={assignedTeam}
// //           onChange={(e) => setAssignedTeam(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //         >
// //           <option value="">Assign to a team...</option>
// //           {teams.map((team) => (
// //             <option key={team.id} value={team.id}>{team.name}</option>
// //           ))}
// //         </select>
// //         <button
// //           type="submit"
// //           className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
// //         >
// //           Create Task
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default CreateTask;








// // import { useState, useEffect } from "react";
// // import { db } from "../firebase";
// // import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
// // import { useAuth } from "../contexts/AuthContext"; // Assuming you're using authentication

// // function CreateTask() {
// //   const { currentUser } = useAuth(); // Get authenticated user
// //   const [title, setTitle] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [assignedTeam, setAssignedTeam] = useState("");
// //   const [priority, setPriority] = useState("medium");
// //   const [dueDate, setDueDate] = useState("");
// //   const [teams, setTeams] = useState([]);

// //   useEffect(() => {
// //     const fetchTeams = async () => {
// //       try {
// //         console.log("Fetching teams...");
// //         const teamsSnapshot = await getDocs(collection(db, "teams"));
// //         const teamsData = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// //         console.log("Fetched teams:", teamsData);
// //         setTeams(teamsData);
// //       } catch (error) {
// //         console.error("Error fetching teams:", error);
// //       }
// //     };

// //     fetchTeams();
// //   }, []);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!title.trim()) {
// //       alert("Task title is required.");
// //       return;
// //     }
// //     if (!assignedTeam) {
// //       alert("Please assign the task to a team.");
// //       return;
// //     }
// //     if (!currentUser) {
// //       alert("You must be logged in to create a task.");
// //       return;
// //     }

// //     const newTask = {
// //       title,
// //       description,
// //       assignedTo: assignedTeam,
// //       priority,
// //       dueDate: dueDate ? new Date(dueDate).toISOString() : null,
// //       status: "todo",
// //       createdBy: currentUser.uid, // Save the user who created the task
// //       createdAt: serverTimestamp(),
// //     };

// //     try {
// //       await addDoc(collection(db, "tasks"), newTask);
// //       setTitle("");
// //       setDescription("");
// //       setAssignedTeam("");
// //       setPriority("medium");
// //       setDueDate("");
// //       alert("Task created successfully!");
// //     } catch (error) {
// //       console.error("Error creating task:", error);
// //       alert("Failed to create task.");
// //     }
// //   };

// //   return (
// //     <div className="p-4 bg-white shadow-md rounded-lg">
// //       <h2 className="text-lg font-bold mb-4">Create New Task</h2>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input
// //           type="text"
// //           placeholder="Task Title"
// //           value={title}
// //           onChange={(e) => setTitle(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //           required
// //         />
// //         <textarea
// //           placeholder="Task Description"
// //           value={description}
// //           onChange={(e) => setDescription(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //         />
// //         <select
// //           value={priority}
// //           onChange={(e) => setPriority(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //         >
// //           <option value="low">Low Priority</option>
// //           <option value="medium">Medium Priority</option>
// //           <option value="high">High Priority</option>
// //         </select>
// //         <input
// //           type="date"
// //           value={dueDate}
// //           onChange={(e) => setDueDate(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //         />
// //         <select
// //           value={assignedTeam}
// //           onChange={(e) => setAssignedTeam(e.target.value)}
// //           className="w-full p-2 border rounded-md"
// //         >
// //           <option value="">Assign to a team...</option>
// //           {teams.map((team) => (
// //             <option key={team.id} value={team.id}>{team.name}</option>
// //           ))}
// //         </select>
// //         <button
// //           type="submit"
// //           className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
// //         >
// //           Create Task
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default CreateTask;










// import { useState, useEffect } from "react";
// import { db } from "../firebase";
// import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
// import { useAuth } from "../contexts/AuthContext"; // Assuming you're using authentication

// function CreateTask() {
//   const { currentUser } = useAuth(); // Get authenticated user
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [assignedTeam, setAssignedTeam] = useState("");
//   const [priority, setPriority] = useState("medium");
//   const [dueDate, setDueDate] = useState("");
//   const [teams, setTeams] = useState([]);
//   const [teamCreators, setTeamCreators] = useState({});

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const teamsSnapshot = await getDocs(collection(db, "teams"));
//         console.log("Fetching teams...", teamsSnapshot);
//         const teamsData = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         console.log("Fetched teams:", teamsData);
//         setTeams(teamsData);
        
//         // Store team creators
//         const creators = {};
//         teamsData.forEach(team => {
//           creators[team.id] = team.createdBy;
//         });
//         setTeamCreators(creators);
//       } catch (error) {
//         console.error("Error fetching teams:", error);
//       }
//     };

//     fetchTeams();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title.trim()) {
//       alert("Task title is required.");
//       return;
//     }
//     if (!assignedTeam) {
//       alert("Please assign the task to a team.");
//       return;
//     }
//     if (!currentUser) {
//       alert("You must be logged in to create a task.");
//       return;
//     }

//     // Check if the current user is the creator of the assigned team
//     if (teamCreators[assignedTeam] !== currentUser.uid) {
//       alert("You can only assign tasks to teams you created.");
//       return;
//     }

//     const newTask = {
//       title,
//       description,
//       assignedTo: assignedTeam,
//       priority,
//       dueDate: dueDate ? new Date(dueDate).toISOString() : null,
//       status: "todo",
//       createdBy: currentUser.uid, // Save the user who created the task
//       createdAt: serverTimestamp(),
//     };

//     try {
//       await addDoc(collection(db, "tasks"), newTask);
//       setTitle("");
//       setDescription("");
//       setAssignedTeam("");
//       setPriority("medium");
//       setDueDate("");
//       alert("Task created successfully!");
//     } catch (error) {
//       console.error("Error creating task:", error);
//       alert("Failed to create task.");
//     }
//   };

//   return (
//     <div className="p-4 bg-white shadow-md rounded-lg">
//       <h2 className="text-lg font-bold mb-4">Create New Task</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Task Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full p-2 border rounded-md"
//           required
//         />
//         <textarea
//           placeholder="Task Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full p-2 border rounded-md"
//         />
//         <select
//           value={priority}
//           onChange={(e) => setPriority(e.target.value)}
//           className="w-full p-2 border rounded-md"
//         >
//           <option value="low">Low Priority</option>
//           <option value="medium">Medium Priority</option>
//           <option value="high">High Priority</option>
//         </select>
//         <input
//           type="date"
//           value={dueDate}
//           onChange={(e) => setDueDate(e.target.value)}
//           className="w-full p-2 border rounded-md"
//         />
//         <select
//           value={assignedTeam}
//           onChange={(e) => setAssignedTeam(e.target.value)}
//           className="w-full p-2 border rounded-md"
//         >
//           <option value="">Assign to a team...</option>
//           {teams.map((team) => (
//             <option key={team.id} value={team.id}>{team.name}</option>
//           ))}
//         </select>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
//         >
//           Create Task
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CreateTask;








import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"; // Ensure this is correctly implemented
import { toast } from "react-toastify";

function CreateTask() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTeam, setAssignedTeam] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamCreators, setTeamCreators] = useState({});

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsSnapshot = await getDocs(collection(db, "teams"));
        if (!teamsSnapshot.empty) {
          const teamsData = teamsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          const creators = {};
          teamsData.forEach(team => {
            creators[team.id] = team.createdBy;
          });

          setTeams(teamsData);
          setTeamCreators(creators);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!currentUser) {
  //     alert("You must be logged in to create a task.");
  //     return;
  //   }

  //   if (!title.trim()) {
  //     alert("Task title is required.");
  //     return;
  //   }

  //   if (!assignedTeam) {
  //     alert("Please assign the task to a team.");
  //     return;
  //   }

  //   // Ensure currentUser.uid exists before checking teamCreators
  //   if (!teamCreators[assignedTeam] || teamCreators[assignedTeam] !== currentUser.uid) {
  //     alert("You can only assign tasks to teams you created.");
  //     return;
  //   }

  //   const newTask = {
  //     title,
  //     description,
  //     assignedTo: assignedTeam,
  //     priority,
  //     dueDate: dueDate ? new Date(dueDate).toISOString() : null,
  //     status: "todo",
  //     createdBy: currentUser.uid,
  //     createdAt: serverTimestamp(),
  //   };

  //   try {
  //     await addDoc(collection(db, "tasks"), newTask);
  //     setTitle("");
  //     setDescription("");
  //     setAssignedTeam("");
  //     setPriority("medium");
  //     setDueDate("");
  //     alert("Task created successfully!");
  //   } catch (error) {
  //     console.error("Error creating task:", error);
  //     alert("Failed to create task.");
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("You must be logged in to create a task.");
    return;
  }

  if (!title.trim()) {
    alert("Task title is required.");
    return;
  }

  if (!assignedTeam) {
    alert("Please assign the task to a team.");
    return;
  }

  if (!teamCreators[assignedTeam] || teamCreators[assignedTeam] !== currentUser.uid) {
    alert("You can only assign tasks to teams you created.");
    return;
  }

  const newTask = {
    title,
    description,
    assignedTo: assignedTeam,
    priority,
    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    status: "todo",
    createdBy: currentUser.uid,
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "tasks"), newTask);

    // Fetch team members' emails
    const teamSnapshot = await getDocs(collection(db, `teams/${assignedTeam}/members`));
    const teamMembers = teamSnapshot.docs.map(doc => doc.data().email);

    // Send an email to all team members
    teamMembers.forEach(async (email) => {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          taskTitle: title,
          createdBy: currentUser.email,
        }),
      });
    });

    setTitle("");
    setDescription("");
    setAssignedTeam("");
    setPriority("medium");
    setDueDate("");
    // alert("Task created successfully");
    toast("task created")
  } catch (error) {
    console.error("Error creating task:", error);
    alert("Failed to create task.");
  }
};



  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <select
          value={assignedTeam}
          onChange={(e) => setAssignedTeam(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Assign to a team...</option>
          {teams.length > 0 ? (
            teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))
          ) : (
            <option disabled>No teams available</option>
          )}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}

export default CreateTask;

