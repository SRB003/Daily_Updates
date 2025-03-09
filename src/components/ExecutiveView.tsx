import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDepartmentStore } from '../store/departmentStore';
import { useWarningStore } from '../store/warningStore';
import { useUpdateStore } from '../store/updateStore';
import { BarChart, Users, AlertTriangle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

function ExecutiveView() {
  const departments = useDepartmentStore((state) => state.departments);
  const user = useAuthStore((state) => state.user);
  const users = useAuthStore((state) => state.users);
  const warnings = useWarningStore((state) => state.warnings);
  const { getAllUpdates } = useUpdateStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const updates = getAllUpdates();
  const filteredUpdates = updates.filter(update => update.date === selectedDate);

  // Filter departments based on user role
  const visibleDepartments = departments.filter(dept => {
    if (user?.role === 'admin' || user?.role === 'ceo') {
      return true; // Show all departments
    } else if (user?.role === 'senior') {
      return dept.id === user.department; // Show only their department
    }
    return false;
  });

  const getDepartmentStats = (departmentId: string) => {
    const departmentUsers = users.filter(u => u.department === departmentId);
    const activeWarnings = warnings.filter(
      warning => 
        !warning.acknowledged && 
        departmentUsers.some(u => u.id === warning.userId)
    );
    const todayUpdates = filteredUpdates.filter(
      update => update.department === departmentId
    );

    return {
      totalEmployees: departmentUsers.length,
      activeWarnings: activeWarnings.length,
      updatesSubmitted: todayUpdates.length,
    };
  };

  // Get relevant updates based on user role
  const getRelevantUpdates = (departmentId: string) => {
    return filteredUpdates.filter(update => {
      if (user?.role === 'admin' || user?.role === 'ceo') {
        return update.department === departmentId;
      } else if (user?.role === 'senior') {
        // Senior developers see only developer updates, senior designers see only designer updates
        const isSeniorDev = user.department === 'dev-1';
        return update.department === departmentId && 
               update.role === (isSeniorDev ? 'developer' : 'designer');
      }
      return false;
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {(user?.role === 'admin' || user?.role === 'ceo') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <h3 className="ml-2 text-lg font-semibold">Total Employees</h3>
            </div>
            <p className="mt-4 text-3xl font-bold">
              {users.filter(u => u.role === 'developer' || u.role === 'designer').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-green-500" />
              <h3 className="ml-2 text-lg font-semibold">Departments</h3>
            </div>
            <p className="mt-4 text-3xl font-bold">{departments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h3 className="ml-2 text-lg font-semibold">Active Warnings</h3>
            </div>
            <p className="mt-4 text-3xl font-bold">
              {warnings.filter(w => !w.acknowledged).length}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {visibleDepartments.map((dept) => {
          const stats = getDepartmentStats(dept.id);
          const departmentUpdates = getRelevantUpdates(dept.id);
          const roleTitle = user?.role === 'senior' 
            ? `${dept.name} - ${dept.id === 'dev-1' ? 'Developers' : 'Designers'}`
            : dept.name;

          return (
            <div key={dept.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{roleTitle}</h2>
                  <div className="flex gap-4">
                    <span className="text-sm text-gray-600">
                      Updates: {stats.updatesSubmitted}/{stats.totalEmployees}
                    </span>
                    {(user?.role === 'admin' || user?.role === 'ceo') && (
                      <span className="text-sm text-red-600">
                        Warnings: {stats.activeWarnings}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Update
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Submission Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departmentUpdates.map((update) => (
                      <tr key={update.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {update.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {update.role}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 whitespace-pre-line">
                            {update.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {format(new Date(update.submissionTime), 'HH:mm')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExecutiveView;