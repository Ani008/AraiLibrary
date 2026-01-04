import { useState } from "react";

const DonorTable = ({ projects = [], surgeries = [] }) => {
  const [filter, setFilter] = useState("monthly");

  const now = new Date();

  const isWithinFilter = (date) => {
    const d = new Date(date);

    if (filter === "daily") {
      return d.toDateString() === now.toDateString();
    }

    if (filter === "weekly") {
      const diff = (now - d) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }

    if (filter === "monthly") {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }

    return true; // yearly
  };

  // Totals
  let totalTarget = 0;
  let totalCompleted = 0;
  let totalIncomplete = 0;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Donor Contributions
        </h3>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-3 text-left">Donor</th>
              <th className="border px-4 py-3 text-center">Target</th>
              <th className="border px-4 py-3 text-center">Completed</th>
              <th className="border px-4 py-3 text-center">Incomplete</th>
              <th className="border px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => {
              const target = project.balanceSurgery;

              const completed = surgeries.filter(
                (s) =>
                  s.projectId === project.id &&
                  isWithinFilter(s.createdAt)
              ).length;

              const incomplete = Math.max(
                target - completed,
                0
              );

              const isCompleted = completed >= target;

              // Accumulate totals
              totalTarget += target;
              totalCompleted += completed;
              totalIncomplete += incomplete;

              return (
                <tr key={project.id}>
                  <td className="border px-4 py-3">
                    {project.projectName}
                  </td>

                  <td className="border px-4 py-3 text-center font-semibold">
                    {target}
                  </td>

                  <td className="border px-4 py-3 text-center text-black-600 font-semibold">
                    {completed}
                  </td>

                  <td className="border px-4 py-3 text-center text-black-600 font-semibold">
                    {incomplete}
                  </td>

                  <td className="border px-4 py-3 text-center">
                    {isCompleted ? "✔" : "—"}
                  </td>
                </tr>
              );
            })}

            {/* TOTAL ROW */}
            <tr className="bg-gray-100 font-bold">
              <td className="border px-4 py-3">TOTAL</td>
              <td className="border px-4 py-3 text-center">
                {totalTarget}
              </td>
              <td className="border px-4 py-3 text-center text-black-600">
                {totalCompleted}
              </td>
              <td className="border px-4 py-3 text-center text-black-600">
                {totalIncomplete}
              </td>
              <td className="border px-4 py-3 text-center">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorTable;
