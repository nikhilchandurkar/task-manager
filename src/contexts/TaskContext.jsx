



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
} from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "./AuthContext"
import { toast } from "react-toastify"

const TaskContext = createContext()

export function useTasks() {
  return useContext(TaskContext)
}

export function TaskProvider({ children }) {
  const { currentUser, userData } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTeam, setCurrentTeam] = useState(null)

  useEffect(() => {
    if (!currentUser || !userData || currentTeam) return

    // Set default team only if it's not already set
    if (userData.teams?.length > 0) {
      setCurrentTeam(userData.teams[0])
    }
  }, [userData, currentUser])

  useEffect(() => {
    if (!currentUser || !currentTeam) {
      setTasks([])
      setLoading(false)
      return
    }

    setLoading(true)
    const q = query(collection(db, "tasks"), where("teamId", "==", currentTeam.id))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching tasks:", error)
        toast.error("Error loading tasks")
        setLoading(false)
      },
    )

    return unsubscribe
  }, [currentUser, currentTeam?.id]) // Only re-run when team ID changes

  async function addTask(taskData) {
    if (!currentUser || !currentTeam) {
      toast.error("No team selected or user not logged in!")
      return
    }

    try {
      const newTask = {
        ...taskData,
        createdBy: currentUser.uid,
        teamId: currentTeam.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: taskData.status || "todo",
      }

      const docRef = await addDoc(collection(db, "tasks"), newTask)
      toast.success("Task added successfully!")
      return { id: docRef.id, ...newTask } // Return full task object
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("Failed to add task")
      throw error
    }
  }

  async function updateTask(taskId, taskData) {
    if (!currentUser) return

    try {
      const taskRef = doc(db, "tasks", taskId)
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid,
      })
      toast.success("Task updated successfully!")
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
      throw error
    }
  }

  async function deleteTask(taskId) {
    if (!currentUser) return

    try {
      await deleteDoc(doc(db, "tasks", taskId))
      toast.success("Task deleted successfully!")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
      throw error
    }
  }

  async function moveTask(taskId, newStatus) {
    return updateTask(taskId, { status: newStatus })
  }

  async function assignTask(taskId, assigneeId) {
    return updateTask(taskId, { assignedTo: assigneeId })
  }

  const value = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    assignTask,
    currentTeam,
    setCurrentTeam,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
