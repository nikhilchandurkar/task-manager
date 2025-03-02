function TeamSelector({ teams, currentTeam, onChange }) {
  return (
    <div className="relative">
      <select
        value={currentTeam?.id || ""}
        onChange={(e) => {
          const teamId = e.target.value
          const team = teams.find((t) => t.id === teamId)
          onChange(teamId)
        }}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="" disabled>
          Select a team
        </option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TeamSelector

