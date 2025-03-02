import { useDrag } from "react-dnd"
import { useTeams } from "../contexts/TeamContext"
import { useTasks } from "../contexts/TaskContext"

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

function TaskCard({ task, onEdit }) {
  const { teamMembers } = useTeams()
  const { currentTeam } = useTasks()

  const assignee = task.assignedTo ? teamMembers[currentTeam?.id]?.[task.assignedTo] : null

  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      className={`bg-white rounded-md shadow p-3 cursor-move ${isDragging ? "opacity-50" : ""}`}
      onClick={onEdit}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority] || "bg-gray-100"}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {assignee ? (
            <div className="flex items-center">
              <img
                src={assignee.photoURL || "https://via.placeholder.com/24"}
                alt={assignee.displayName}
                className="w-6 h-6 rounded-full mr-1"
              />
              <span className="text-xs text-gray-500">{assignee.displayName}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-500">Unassigned</span>
          )}
        </div>

        {task.dueDate && <span className="text-xs text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</span>}
      </div>
    </div>
  )
}

export default TaskCard

