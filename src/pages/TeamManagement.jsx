







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
  const auth = useAuth(); 
  const currentUser = auth?.currentUser; // Ensure currentUser is not undefined
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
        </div>

        {teams.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 mb-4">You don't have any teams yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow overflow-hidden p-6">
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
