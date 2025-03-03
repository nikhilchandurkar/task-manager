




// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { db } from "../firebase"; // Import Firestore instance
// import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
// import { useAuth } from "../contexts/AuthContext";
// import { TeamProvider } from "../contexts/TeamContext";
// import Navbar from "../components/Navbar";
// import CreateTeamModal from "../components/CreateTeamModal";
// import AddMemberModal from "../components/AddMemberModal";

// function TeamManagementContent() {
//   const { currentUser } = useAuth();
//   const [teams, setTeams] = useState([]);
//   const [teamMembers, setTeamMembers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
//   const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [expandedTeamId, setExpandedTeamId] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!currentUser?.uid) {
//       setLoading(false);
//       return;
//     }

//     console.log("Current user:", currentUser.uid);
    
//     const fetchTeams = async () => {
//       try {
//         // First, try to fetch from a user-teams collection if it exists
//         const userTeamsQuery = query(
//           collection(db, "teams"), 
//           where("userId", "==", currentUser.uid)
//         );
        
//         const userTeamsSnapshot = await getDocs(userTeamsQuery);
//         console.log(userTeamsSnapshot);
//         if (!userTeamsSnapshot.empty) {
//           console.log("Found user-teams mapping");
//           const teamIds = [];
//           userTeamsSnapshot.forEach(doc => {
//             if (doc.data().teamId) {
//               teamIds.push(doc.data().teamId);
//             }
//           });
          
//           if (teamIds.length > 0) {
//             const teamDocs = await Promise.all(
//               teamIds.map(id => getDoc(doc(db, "teams", id)))
//             );
            
//             const fetchedTeams = teamDocs
//               .filter(doc => doc.exists())
//               .map(doc => ({ id: doc.id, ...doc.data() }));
              
//             console.log("Teams fetched via user-teams:", fetchedTeams.length);
//             setTeams(fetchedTeams);
//             fetchTeamMembers(fetchedTeams);
//             setLoading(false);
//             return;
//           }
//         }
//         const teamsSnapshot = await getDocs(collection(db, "teams"));
//         console.log("All teams count:", teamsSnapshot.size);
        
//         const allTeams = [];
//         teamsSnapshot.forEach(doc => {
//           const teamData = doc.data();
//           console.log("Team:", doc.id, teamData);
//           let isMember = false;
//           if (Array.isArray(teamData.members) && teamData.members.includes(currentUser.uid)) {
//             isMember = true;
//           }
//           if (Array.isArray(teamData.memberIds) && teamData.memberIds.includes(currentUser.uid)) {
//             isMember = true;
//           }
//           if (teamData.members && teamData.members[currentUser.uid]) {
//             isMember = true;
//           }
//           if (teamData.createdBy === currentUser.uid) {
//             isMember = true;
//           }
          
//           if (isMember) {
//             allTeams.push({ id: doc.id, ...teamData });
//           }
//         });
        
//         console.log("Teams found after checking membership:", allTeams.length);
//         setTeams(allTeams);
//         fetchTeamMembers(allTeams);
        
//       } catch (error) {
//         console.log("Error fetching teams:", error);
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
//       memberData[team.id] = {};
//       let memberIds = [];
//       if (Array.isArray(team.members)) {
//         memberIds = team.members;
//       } 
//       // If memberIds is an array
//       else if (Array.isArray(team.memberIds)) {
//         memberIds = team.memberIds;
//       }
//       // If members is an object with user IDs as keys
//       else if (team.members && typeof team.members === 'object') {
//         memberIds = Object.keys(team.members);
//       }
      
//       // Always include the creator
//       if (team.createdBy && !memberIds.includes(team.createdBy)) {
//         memberIds.push(team.createdBy);
//       }
      
//       if (memberIds.length === 0) continue;
      
//       try {
//         // Process member IDs in batches of 10 (Firestore limit for "in" queries)
//         const batchSize = 10;
        
//         for (let i = 0; i < memberIds.length; i += batchSize) {
//           const batch = memberIds.slice(i, i + batchSize);
//           const userQuery = query(collection(db, "users"), where("uid", "in", batch));
//           const userSnapshot = await getDocs(userQuery);
          
//           if (userSnapshot.empty) {
//             console.log("No user documents found for batch:", batch);
            
//             // If no user documents found, create placeholder entries
//             batch.forEach(uid => {
//               memberData[team.id][uid] = { uid, displayName: `User ${uid.slice(0, 5)}...` };
//             });
//             continue;
//           }
          
//           userSnapshot.forEach(doc => {
//             const userData = doc.data();
//             memberData[team.id][userData.uid] = userData;
//           });
//         }
//       } catch (error) {
//         console.error(`Error fetching members for team ${team.id}:`, error);
//       }
//     }
    
//     setTeamMembers(memberData);
//   }, []);

//   // Delete Team
//   const handleDeleteTeam = async (teamId, teamName) => {
//     if (!window.confirm(`Are you sure you want to delete the team "${teamName}"?`)) return;
    
//     try {
//       await deleteDoc(doc(db, "teams", teamId));
//       setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
//     } catch (error) {
//       console.error("Failed to delete team:", error);
//       alert(`Error deleting team: ${error.message}`);
//     }
//   };

//   // Remove Member from Team
//   const handleRemoveMember = async (teamId, userId) => {
//     if (!window.confirm("Are you sure you want to remove this member?")) return;
    
//     try {
//       const teamDocRef = doc(db, "teams", teamId);
//       const teamToUpdate = teams.find((team) => team.id === teamId);
      
//       if (!teamToUpdate) {
//         throw new Error("Team not found");
//       }
      
//       // Handle different member storage patterns
//       let updateData = {};
      
//       if (Array.isArray(teamToUpdate.members)) {
//         updateData.members = teamToUpdate.members.filter(id => id !== userId);
//       } 
//       else if (Array.isArray(teamToUpdate.memberIds)) {
//         updateData.memberIds = teamToUpdate.memberIds.filter(id => id !== userId);
//       }
//       else if (teamToUpdate.members && typeof teamToUpdate.members === 'object') {
//         // Create a new object without the removed member
//         const updatedMembers = { ...teamToUpdate.members };
//         delete updatedMembers[userId];
//         updateData.members = updatedMembers;
//       }
      
//       await updateDoc(teamDocRef, updateData);
      
//       // Update local state
//       setTeams(prevTeams => prevTeams.map(team => {
//         if (team.id === teamId) {
//           return { ...team, ...updateData };
//         }
//         return team;
//       }));
      
//     } catch (error) {
//       console.error("Failed to remove member:", error);
//       alert(`Error removing member: ${error.message}`);
//     }
//   };

//   // Handle clicking on a team card
//   const handleTeamCardClick = (teamId) => {
//     setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
//   };

//   // Helper function to get member IDs from a team
//   const getMemberIds = (team) => {
//     let memberIds = [];
//     if (Array.isArray(team.members)) {
//       memberIds = team.members;
//     } else if (Array.isArray(team.memberIds)) {
//       memberIds = team.memberIds;
//     } else if (team.members && typeof team.members === 'object') {
//       memberIds = Object.keys(team.members);
//     }
    
//     // Always include creator
//     if (team.createdBy && !memberIds.includes(team.createdBy)) {
//       memberIds.push(team.createdBy);
//     }
    
//     return memberIds;
//   };

//   // Helper function to get the display name for a member
//   const getMemberDisplayName = (member) => {
//     if (!member) return "Unknown User";
    
//     // Check different possible properties for the user's display name
//     if (member.displayName) return member.displayName;
//     if (member.name) return member.name;
//     if (member.Name) return member.Name;
//     if (member.email) return member.email;
//     if (member.Email) return member.Email;
    
//     // Fallback to a shortened version of the UID
//     return member.uid ? `User ${member.uid.slice(0, 5)}...` : "Unknown User";
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen">Loading teams...</div>;
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100">
//         <Navbar />
//         <div className="container mx-auto px-4 py-6">
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{error}</span>
//             <p className="mt-2">Please refresh the page or contact support if the issue persists.</p>
//           </div>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
//           >
//             Refresh Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="container mx-auto px-4 py-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
//           <button onClick={() => setIsCreateTeamModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">Create Team</button>
//         </div>

//         {teams.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <p className="text-gray-600 mb-4">You don't have any teams yet.</p>
//             <button onClick={() => setIsCreateTeamModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">Create Your First Team</button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {teams.map((team) => {
//               const memberIds = getMemberIds(team);
              
//               return (
//                 <div key={team.id} className="bg-white rounded-lg shadow overflow-hidden">
//                   <div 
//                     className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
//                     onClick={() => handleTeamCardClick(team.id)}
//                   >
//                     <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
//                     <p className="text-gray-600 mb-4">{memberIds.length} members</p>
                    
//                     {/* Show members only when this team is expanded */}
//                     {expandedTeamId === team.id && memberIds.length > 0 && (
//                       <div className="mb-4">
//                         <h3 className="text-md font-medium mb-2">Team Members:</h3>
//                         <ul className="space-y-2">
//                           {memberIds.map((memberId) => {
//                             const member = teamMembers[team.id]?.[memberId];
//                             return (
//                               <li key={memberId} className="flex justify-between items-center border-b pb-2">
//                                 <div>
//                                   <span className="text-gray-800">
//                                     {getMemberDisplayName(member)}
//                                   </span>
//                                   {team.createdBy === memberId && (
//                                     <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>
//                                   )}
//                                 </div>
//                                 {currentUser.uid === team.createdBy && currentUser.uid !== memberId && (
//                                   <button 
//                                     onClick={(e) => {
//                                       e.stopPropagation(); // Prevent card click when clicking the button
//                                       handleRemoveMember(team.id, memberId);
//                                     }}
//                                     className="text-xs text-red-600 hover:text-red-800"
//                                   >
//                                     Remove
//                                   </button>
//                                 )}
//                               </li>
//                             );
//                           })}
//                         </ul>
//                       </div>
//                     )}
                    
//                     <div className="flex space-x-2 mt-4">
//                       <button 
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent card click when clicking the button
//                           setSelectedTeam(team);
//                           setIsAddMemberModalOpen(true);
//                         }} 
//                         className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md text-sm"
//                       >
//                         Add Member
//                       </button>
//                       {team.createdBy === currentUser.uid && (
//                         <button 
//                           onClick={(e) => {
//                             e.stopPropagation(); // Prevent card click when clicking the button
//                             handleDeleteTeam(team.id, team.name);
//                           }} 
//                           className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md text-sm"
//                         >
//                           Delete Team
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
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




"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { TeamProvider } from "../contexts/TeamContext";
import Navbar from "../components/Navbar";
import CreateTeamModal from "../components/CreateTeamModal";
import AddMemberModal from "../components/AddMemberModal";

function TeamManagementContent() {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }
    
    const fetchTeams = async () => {
      try {
        const userTeamsQuery = query(
          collection(db, "teams"), 
          where("userId", "==", currentUser.uid)
        );
        
        const userTeamsSnapshot = await getDocs(userTeamsQuery);
        if (!userTeamsSnapshot.empty) {
          const teamIds = [];
          userTeamsSnapshot.forEach(doc => {
            if (doc.data().teamId) {
              teamIds.push(doc.data().teamId);
            }
          });
          
          if (teamIds.length > 0) {
            const teamDocs = await Promise.all(
              teamIds.map(id => getDoc(doc(db, "teams", id)))
            );
            
            const fetchedTeams = teamDocs
              .filter(doc => doc.exists())
              .map(doc => ({ id: doc.id, ...doc.data() }));
              
            setTeams(fetchedTeams);
            fetchTeamMembers(fetchedTeams);
            setLoading(false);
            return;
          }
        }

        const teamsSnapshot = await getDocs(collection(db, "teams"));
        const allTeams = [];
        teamsSnapshot.forEach(doc => {
          const teamData = doc.data();
          let isMember = false;
          
          if (Array.isArray(teamData.members) && teamData.members.includes(currentUser.uid)) {
            isMember = true;
          }
          if (Array.isArray(teamData.memberIds) && teamData.memberIds.includes(currentUser.uid)) {
            isMember = true;
          }
          if (teamData.members && teamData.members[currentUser.uid]) {
            isMember = true;
          }
          if (teamData.createdBy === currentUser.uid) {
            isMember = true;
          }
          
          if (isMember) {
            allTeams.push({ id: doc.id, ...teamData });
          }
        });
        
        setTeams(allTeams);
        fetchTeamMembers(allTeams);
        
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
      memberData[team.id] = {};
      let memberIds = [];
      
      if (Array.isArray(team.members)) {
        memberIds = team.members;
      } 
      else if (Array.isArray(team.memberIds)) {
        memberIds = team.memberIds;
      }
      else if (team.members && typeof team.members === 'object') {
        memberIds = Object.keys(team.members);
      }
      
      if (team.createdBy && !memberIds.includes(team.createdBy)) {
        memberIds.push(team.createdBy);
      }
      
      if (memberIds.length === 0) continue;
      
      try {
        const batchSize = 10;
        
        for (let i = 0; i < memberIds.length; i += batchSize) {
          const batch = memberIds.slice(i, i + batchSize);
          const userQuery = query(collection(db, "users"), where("uid", "in", batch));
          const userSnapshot = await getDocs(userQuery);
          
          if (userSnapshot.empty) {
            batch.forEach(uid => {
              memberData[team.id][uid] = { uid, displayName: `User ${uid.slice(0, 5)}...` };
            });
            continue;
          }
          
          userSnapshot.forEach(doc => {
            const userData = doc.data();
            memberData[team.id][userData.uid] = userData;
          });
        }
      } catch (error) {
        // Handle error silently
      }
    }
    
    setTeamMembers(memberData);
  }, []);

  const handleDeleteTeam = async (teamId, teamName) => {
    if (!window.confirm(`Are you sure you want to delete the team "${teamName}"?`)) return;
    
    try {
      await deleteDoc(doc(db, "teams", teamId));
      setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
    } catch (error) {
      alert(`Error deleting team: ${error.message}`);
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    
    try {
      const teamDocRef = doc(db, "teams", teamId);
      const teamToUpdate = teams.find((team) => team.id === teamId);
      
      if (!teamToUpdate) {
        throw new Error("Team not found");
      }
      
      let updateData = {};
      
      if (Array.isArray(teamToUpdate.members)) {
        updateData.members = teamToUpdate.members.filter(id => id !== userId);
      } 
      else if (Array.isArray(teamToUpdate.memberIds)) {
        updateData.memberIds = teamToUpdate.memberIds.filter(id => id !== userId);
      }
      else if (teamToUpdate.members && typeof teamToUpdate.members === 'object') {
        const updatedMembers = { ...teamToUpdate.members };
        delete updatedMembers[userId];
        updateData.members = updatedMembers;
      }
      
      await updateDoc(teamDocRef, updateData);
      
      setTeams(prevTeams => prevTeams.map(team => {
        if (team.id === teamId) {
          return { ...team, ...updateData };
        }
        return team;
      }));
      
    } catch (error) {
      alert(`Error removing member: ${error.message}`);
    }
  };

  const handleTeamCardClick = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  const getMemberIds = (team) => {
    let memberIds = [];
    if (Array.isArray(team.members)) {
      memberIds = team.members;
    } else if (Array.isArray(team.memberIds)) {
      memberIds = team.memberIds;
    } else if (team.members && typeof team.members === 'object') {
      memberIds = Object.keys(team.members);
    }
    
    if (team.createdBy && !memberIds.includes(team.createdBy)) {
      memberIds.push(team.createdBy);
    }
    
    return memberIds;
  };

  const getMemberDisplayName = (member) => {
    if (!member) return "Unknown User";
    
    if (member.displayName) return member.displayName;
    if (member.name) return member.name;
    if (member.email) return member.email;
    
    return member.uid
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading teams...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <p className="mt-2">Please refresh the page or contact support if the issue persists.</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
          <button onClick={() => setIsCreateTeamModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">Create Team</button>
        </div>

        {teams.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 mb-4">You don't have any teams yet.</p>
            <button onClick={() => setIsCreateTeamModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">Create Your First Team</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const memberIds = getMemberIds(team);
              
              return (
                <div key={team.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleTeamCardClick(team.id)}
                  >
                    <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
                    <p className="text-gray-600 mb-4">{memberIds.length} members</p>
                    
                    {expandedTeamId === team.id && memberIds.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-md font-medium mb-2">Team Members:</h3>
                        <ul className="space-y-2">
                          {memberIds.map((memberId) => {
                            const member = teamMembers[team.id]?.[memberId];
                            return (
                              <li key={memberId} className="flex justify-between items-center border-b pb-2">
                                <div>
                                  <span className="text-gray-800">
                                    {getMemberDisplayName(member)}
                                  </span>
                                  {team.createdBy === memberId && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>
                                  )}
                                </div>
                                {currentUser.uid === team.createdBy && currentUser.uid !== memberId && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveMember(team.id, memberId);
                                    }}
                                    className="text-xs text-red-600 hover:text-red-800"
                                  >
                                    Remove
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeam(team);
                          setIsAddMemberModalOpen(true);
                        }} 
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md text-sm"
                      >
                        Add Member
                      </button>
                      {team.createdBy === currentUser.uid && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team.id, team.name);
                          }} 
                          className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md text-sm"
                        >
                          Delete Team
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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