"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDoc,
  getDocs,
} from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "./AuthContext"
import { toast } from "react-toastify"

const TeamContext = createContext()

export function useTeams() {
  return useContext(TeamContext)
}

export function TeamProvider({ children }) {
  const { currentUser, userData, fetchUserData } = useAuth()
  const [teams, setTeams] = useState([])
  const [teamMembers, setTeamMembers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser || !userData) {
      setTeams([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Get teams where user is a member
    const q = query(collection(db, "teams"), where("members", "array-contains", currentUser.uid))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const teamList = []
        querySnapshot.forEach((doc) => {
          teamList.push({ id: doc.id, ...doc.data() })
        })
        setTeams(teamList)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching teams:", error)
        toast.error("Error loading teams")
        setLoading(false)
      },
    )

    return unsubscribe
  }, [currentUser, userData])

  // Fetch team members for each team
  useEffect(() => {
    if (!teams.length) return

    const fetchMembers = async () => {
      const membersData = {}

      for (const team of teams) {
        membersData[team.id] = {}

        for (const memberId of team.members) {
          try {
            const userDoc = await getDoc(doc(db, "users", memberId))
            if (userDoc.exists()) {
              membersData[team.id][memberId] = userDoc.data()
            }
          } catch (error) {
            console.error(`Error fetching member ${memberId}:`, error)
          }
        }
      }

      setTeamMembers(membersData)
    }

    fetchMembers()
  }, [teams])

  async function createTeam(teamName) {
    if (!currentUser) return

    try {
      const newTeam = {
        name: teamName,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        members: [currentUser.uid],
        admins: [currentUser.uid],
      }

      const docRef = await addDoc(collection(db, "teams"), newTeam)

      // Update user's teams array
      const userRef = doc(db, "users", currentUser.uid)
      await updateDoc(userRef, {
        teams: arrayUnion({ id: docRef.id, name: teamName }),
      })

      await fetchUserData(currentUser.uid)
      toast.success("Team created successfully!")
      return docRef
    } catch (error) {
      console.error("Error creating team:", error)
      toast.error("Failed to create team")
      throw error
    }
  }

  async function updateTeam(teamId, teamData) {
    if (!currentUser) return

    try {
      const teamRef = doc(db, "teams", teamId)
      await updateDoc(teamRef, {
        ...teamData,
        updatedAt: serverTimestamp(),
      })
      toast.success("Team updated successfully!")
    } catch (error) {
      console.error("Error updating team:", error)
      toast.error("Failed to update team")
      throw error
    }
  }

  async function deleteTeam(teamId, teamName) {
    if (!currentUser) return

    try {
      await deleteDoc(doc(db, "teams", teamId))

      // Update user's teams array for all members
      const teamDoc = await getDoc(doc(db, "teams", teamId))
      if (teamDoc.exists()) {
        const members = teamDoc.data().members

        for (const memberId of members) {
          const userRef = doc(db, "users", memberId)
          await updateDoc(userRef, {
            teams: arrayRemove({ id: teamId, name: teamName }),
          })
        }
      }

      await fetchUserData(currentUser.uid)
      toast.success("Team deleted successfully!")
    } catch (error) {
      console.error("Error deleting team:", error)
      toast.error("Failed to delete team")
      throw error
    }
  }

  async function addMemberToTeam(teamId, email) {
    if (!currentUser) return

    try {
      // Find user by email
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("email", "==", email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        toast.error("User not found")
        return
      }

      const userDoc = querySnapshot.docs[0]
      const userId = userDoc.id
      const userData = userDoc.data()

      // Check if user is already a member
      const teamRef = doc(db, "teams", teamId)
      const teamDoc = await getDoc(teamRef)

      if (!teamDoc.exists()) {
        toast.error("Team not found")
        return
      }

      const teamData = teamDoc.data()

      if (teamData.members.includes(userId)) {
        toast.info("User is already a member of this team")
        return
      }

      // Add user to team
      await updateDoc(teamRef, {
        members: arrayUnion(userId),
      })

      // Add team to user's teams
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        teams: arrayUnion({ id: teamId, name: teamData.name }),
      })

      toast.success("Member added to team successfully!")
    } catch (error) {
      console.error("Error adding member to team:", error)
      toast.error("Failed to add member to team")
      throw error
    }
  }

  async function removeMemberFromTeam(teamId, userId, teamName) {
    if (!currentUser) return

    try {
      // Remove user from team
      const teamRef = doc(db, "teams", teamId)
      await updateDoc(teamRef, {
        members: arrayRemove(userId),
        admins: arrayRemove(userId),
      })

      // Remove team from user's teams
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        teams: arrayRemove({ id: teamId, name: teamName }),
      })

      toast.success("Member removed from team successfully!")
    } catch (error) {
      console.error("Error removing member from team:", error)
      toast.error("Failed to remove member from team")
      throw error
    }
  }

  const value = {
    teams,
    teamMembers,
    loading,
    createTeam,
    updateTeam,
    deleteTeam,
    addMemberToTeam,
    removeMemberFromTeam,
  }

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}

