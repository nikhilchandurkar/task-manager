


// "use client"

// import { createContext, useContext, useState, useEffect, useMemo } from "react"
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithPopup,
//   updateProfile,
// } from "firebase/auth"
// import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
// import { auth, db } from "../firebase"
// import { toast } from "react-toastify"

// const AuthContext = createContext(null)

// export function useAuth() {

//   return useContext(AuthContext)
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null)
//   const [userData, setUserData] = useState(null)
//   const [loading, setLoading] = useState(true)

//   async function signup(email, password, displayName) {
//     try {
//       const { user } = await createUserWithEmailAndPassword(auth, email, password)
//       await updateProfile(user, { displayName })

//       const userData = {
//         uid: user.uid,
//         email: user.email,
//         displayName,
//         photoURL: user.photoURL || null,
//         createdAt: serverTimestamp(),
//         teams: [],
//       }

//       await setDoc(doc(db, "users", user.uid), userData)
//       setUserData(userData) 

//       toast.success("Account created successfully!")
//       return user
//     } catch (error) {
//       toast.error(error.message || "Signup failed!")
//       throw error
//     }
//   }

//   // ✅ Login Function
//   async function login(email, password) {
//     try {
//       const { user } = await signInWithEmailAndPassword(auth, email, password)
//       toast.success("Logged in successfully!")
//       return user
//     } catch (error) {
//       toast.error(error.message || "Login failed!")
//       throw error
//     }
//   }

//   // ✅ Google Login
//   async function loginWithGoogle() {
//     try {
//       const provider = new GoogleAuthProvider()
//       const { user } = await signInWithPopup(auth, provider)

//       const userDoc = await getDoc(doc(db, "users", user.uid))
//       if (!userDoc.exists()) {
//         const userData = {
//           uid: user.uid,
//           email: user.email,
//           displayName: user.displayName,
//           photoURL: user.photoURL,
//           createdAt: serverTimestamp(),
//           teams: [],
//         }

//         await setDoc(doc(db, "users", user.uid), userData)
//         setUserData(userData)
//       }

//       toast.success("Logged in with Google successfully!")
//       return user
//     } catch (error) {
//       toast.error(error.message || "Google login failed!")
//       throw error
//     }
//   }

//   // ✅ Logout Function
//   async function logout() {
//     try {
//       await signOut(auth)
//       setUserData(null) // ✅ Clear user data on logout
//       toast.info("Logged out successfully")
//     } catch (error) {
//       toast.error("Logout failed!")
//     }
//   }

//   // ✅ Fetch User Data from Firestore
//   async function fetchUserData(uid) {
//     try {
//       const userDoc = await getDoc(doc(db, "users", uid))
//       if (userDoc.exists()) {
//         setUserData(userDoc.data())
//         return userDoc.data()
//       }
//       return null
//     } catch (error) {
//       console.error("Error fetching user data:", error)
//       toast.error("Failed to load user data")
//       return null
//     }
//   }

//   // ✅ Auth State Listener (Fires on Login/Logout)
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setLoading(true)
//       setCurrentUser(user)

//       if (user) {
//         const data = await fetchUserData(user.uid)
//         setUserData(data)
//       } else {
//         setUserData(null)
//       }

//       setLoading(false)
//     })

//     return () => unsubscribe()
//   }, [])

//   // ✅ Memoize Context Value for Optimization
//   const value = useMemo(
//     () => ({
//       currentUser,
//       userData,
//       signup,
//       login,
//       loginWithGoogle,
//       logout,
//       fetchUserData,
//       loading,
//     }),
//     [currentUser, userData, loading]
//   )

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }



"use client"

import { createContext, useContext, useState, useEffect, useMemo } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs } from "firebase/firestore"
import { auth, db } from "../firebase"
import { toast } from "react-toastify"

const AuthContext = createContext(null)

export function useAuth() {
  // if (!auth || !auth.currentUser) return <p>Loading...</p>;
  return useContext(AuthContext)

}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(email, password, displayName) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName })

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        teams: [],
      }

      await setDoc(doc(db, "users", user.uid), userData)
      setUserData(userData) 

      toast.success("Account created successfully!")
      return user
    } catch (error) {
      toast.error(error.message || "Signup failed!")
      throw error
    }
  }

  async function login(email, password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      toast.success("Logged in successfully!")
      return user
    } catch (error) {
      toast.error(error.message || "Login failed!")
      throw error
    }
  }

  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)

      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (!userDoc.exists()) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          teams: [],
        }

        await setDoc(doc(db, "users", user.uid), userData)
        setUserData(userData)
      }

      toast.success("Logged in with Google successfully!")
      return user
    } catch (error) {
      toast.error(error.message || "Google login failed!")
      throw error
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      setUserData(null)
      toast.info("Logged out successfully")
    } catch (error) {
      toast.error("Logout failed!")
    }
  }

  async function fetchUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data())
        return userDoc.data()
      }
      return null
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast.error("Failed to load user data")
      return null
    }
  }

  async function getTeamsData(uid) {
    try {
      const teamsCollection = collection(db, "users", uid, "teams")
      const teamsSnapshot = await getDocs(teamsCollection)
      const teams = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      return teams
    } catch (error) {
      console.error("Error fetching teams:", error)
      toast.error("Failed to load teams data")
      return []
    }
  }

  async function getTaskData(uid) {
    try {
      const tasksCollection = collection(db, "users", uid, "tasks")
      const tasksSnapshot = await getDocs(tasksCollection)
      const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      return tasks
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to load tasks data")
      return []
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true)
      setCurrentUser(user)

      if (user) {
        const data = await fetchUserData(user.uid)
        setUserData(data)
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      userData,
      signup,
      login,
      loginWithGoogle,
      logout,
      fetchUserData,
      getTeamsData,
      getTaskData,
      loading,
    }),
    [currentUser, userData, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
