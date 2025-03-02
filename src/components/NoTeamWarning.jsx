"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import CreateTeamModal from "./CreateTeamModal"

function NoTeamWarning() {
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <h2 className="text-xl font-bold mb-2">No Teams Found</h2>
      <p className="text-gray-600 mb-6">You need to create or join a team to start managing tasks.</p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => setIsCreateTeamModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Create a Team
        </button>

        <Link to="/team" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">
          Manage Teams
        </Link>
      </div>

      <CreateTeamModal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)} />
    </div>
  )
}

export default NoTeamWarning

