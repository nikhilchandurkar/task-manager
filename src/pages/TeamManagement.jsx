






// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { db } from "../firebase";
// import { 
//   collection, query, where, getDocs, doc, getDoc 
// } from "firebase/firestore";
// import { useAuth } from "../contexts/AuthContext";
// import { TeamProvider } from "../contexts/TeamContext";
// import Navbar from "../components/Navbar";
// import CreateTeamModal from "../components/CreateTeamModal";
// import AddMemberModal from "../components/AddMemberModal";

// function TeamManagementContent() {
//   const { currentUser } = useAuth() || {}; 
//   const [teams, setTeams] = useState([]);
//   const [teamMembers, setTeamMembers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
//   const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
//   const [selectedTeam, setSelectedTeam] = useState(null);

//   useEffect(() => {
//     if (!currentUser?.uid) {
//       setLoading(false);
//       return;
//     }

//     const fetchTeams = async () => {
//       try {
//         const teamsSnapshot = await getDocs(collection(db, "teams"));
//         const fetchedTeams = [];

//         teamsSnapshot.forEach((doc) => {
//           const teamData = doc.data();
//           if (
//             teamData.createdBy === currentUser.uid ||
//             (Array.isArray(teamData.members) && teamData.members.includes(currentUser.uid))
//           ) {
//             fetchedTeams.push({ id: doc.id, ...teamData });
//           }
//         });

//         setTeams(fetchedTeams);
//         fetchTeamMembers(fetchedTeams);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeams();
//   }, [currentUser?.uid]);

//   const fetchTeamMembers = useCallback(async (teamList) => {
//     const memberData = {};

//     for (const team of teamList) {
//       const memberIds = Array.isArray(team.members) ? team.members : [];
//       if (team.createdBy && !memberIds.includes(team.createdBy)) {
//         memberIds.push(team.createdBy);
//       }

//       if (memberIds.length === 0) continue;

//       try {
//         const userQuery = query(collection(db, "users"), where("uid", "in", memberIds));
//         const userSnapshot = await getDocs(userQuery);
//         memberData[team.id] = {};

//         userSnapshot.forEach((doc) => {
//           const userData = doc.data();
//           memberData[team.id][userData.uid] = userData;
//         });
//       } catch (error) {
//         console.error("Error fetching team members:", error);
//       }
//     }

//     setTeamMembers(memberData);
//   }, []);

//   if (loading) return <div className="flex items-center justify-center h-screen">Loading teams...</div>;

//   if (error) return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="container mx-auto px-4 py-6">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//           <strong>Error:</strong> {error}
//         </div>
//         <button 
//           onClick={() => window.location.reload()} 
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
//         >
//           Refresh Page
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="container mx-auto px-4 py-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
//         </div>

//         {teams.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <p className="text-gray-600">You don't have any teams yet.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {teams.map((team) => (
//               <div key={team.id} className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
//                 <p className="text-gray-600">{team.members?.length || 0} members</p>
//               </div>
//             ))}
//           </div>
//         )}

//         <CreateTeamModal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)} />
//         <AddMemberModal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)} team={selectedTeam} />
//       </div>
//     </div>
//   );
// }

// function TeamManagement() {
//   return (
//     <TeamProvider>
//       <TeamManagementContent />
//     </TeamProvider>
//   );
// }

// export default TeamManagement;






"use client"; // Ensures this component is client-only

import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { TeamProvider } from "../contexts/TeamContext";
import Navbar from "../components/Navbar";
import CreateTeamModal from "../components/CreateTeamModal";
import AddMemberModal from "../components/AddMemberModal";

function TeamManagementContent() {
  const [isClient, setIsClient] = useState(false);
  const auth = useAuth(); // Ensure auth is accessed only on client
  const currentUser = auth?.currentUser;

  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    setIsClient(true); // Prevents pre-render issues

    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    const fetchTeams = async () => {
      try {
        const teamsSnapshot = await getDocs(collection(db, "teams"));
        const fetchedTeams = [];

        teamsSnapshot.forEach((doc) => {
          const teamData = doc.data();
          if (
            teamData.createdBy === currentUser.uid ||
            (Array.isArray(teamData.members) && teamData.members.includes(currentUser.uid))
          ) {
            fetchedTeams.push({ id: doc.id, ...teamData });
          }
        });

        setTeams(fetchedTeams);
        fetchTeamMembers(fetchedTeams);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [currentUser?.uid]);

  const fetchTeamMembers = useCallback(async (teamList) => {
    const memberData = {};

    for (const team of teamList) {
      const memberIds = Array.isArray(team.members) ? team.members : [];
      if (team.createdBy && !memberIds.includes(team.createdBy)) {
        memberIds.push(team.createdBy);
      }

      if (memberIds.length === 0) continue;

      try {
        const userQuery = query(collection(db, "users"), where("uid", "in", memberIds));
        const userSnapshot = await getDocs(userQuery);
        memberData[team.id] = {};

        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          memberData[team.id][userData.uid] = userData;
        });
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    }

    setTeamMembers(memberData);
  }, []);

  if (!isClient) return null; // Prevents rendering on server

  if (loading) return <div className="flex items-center justify-center h-screen">Loading teams...</div>;

  if (error) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
        </div>

        {teams.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">You don't have any teams yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
                <p className="text-gray-600">{team.members?.length || 0} members</p>
              </div>
            ))}
          </div>
        )}

        <CreateTeamModal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)} />
        <AddMemberModal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)} team={selectedTeam} />
      </div>
    </div>
  );
}

function TeamManagement() {
  return (
    <TeamProvider>
      <TeamManagementContent />
    </TeamProvider>
  );
}

export default TeamManagement;
