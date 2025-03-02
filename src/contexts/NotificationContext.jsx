"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export function useNotifications() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    setLoading(true)

    // Query notifications for the current user
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(20),
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const notificationList = []
        let unread = 0

        querySnapshot.forEach((doc) => {
          const notification = { id: doc.id, ...doc.data() }
          notificationList.push(notification)

          if (!notification.read) {
            unread++
          }
        })

        setNotifications(notificationList)
        setUnreadCount(unread)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching notifications:", error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [currentUser])

  async function markAsRead(notificationId) {
    if (!currentUser) return

    try {
      const notificationRef = doc(db, "notifications", notificationId)
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  async function markAllAsRead() {
    if (!currentUser || notifications.length === 0) return

    try {
      const promises = notifications
        .filter((notification) => !notification.read)
        .map((notification) => {
          const notificationRef = doc(db, "notifications", notification.id)
          return updateDoc(notificationRef, {
            read: true,
            readAt: serverTimestamp(),
          })
        })

      await Promise.all(promises)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  // This function would typically be called from a Cloud Function
  // But for demo purposes, we'll implement it client-side
  async function createNotification(userId, message, relatedTo = null) {
    try {
      await addDoc(collection(db, "notifications"), {
        userId,
        message,
        relatedTo,
        read: false,
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error creating notification:", error)
    }
  }

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createNotification,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

