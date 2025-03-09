import React, { useState } from 'react';
import { useUpdateStore } from '../store/updateStore';
import { Send, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function Dashboard() {
  const defaultTemplate = "1. ";
  
  const [updateContent, setUpdateContent] = useState(defaultTemplate);
  const [name, setName] = useState('');
  const [role, setRole] = useState('developer');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { addUpdate, getAllUpdates } = useUpdateStore();

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.endsWith('\n')) {
      const lines = newContent.trim().split('\n');
      const lastNumber = lines.length + 1;
      setUpdateContent(newContent + `${lastNumber}. `);
    } else {
      setUpdateContent(newContent);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const department = role === 'developer' ? 'dev-1' : 'design-1';
    addUpdate(name, updateContent, department, role);
    toast.success('Update submitted successfully!', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#10B981',
      },
    });
    setUpdateContent(defaultTemplate);
    setName('');
  };

  const updates = getAllUpdates();
  const userUpdates = updates.filter(update => update.name === name);

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Daily Updates Submission</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 text-lg border-gray-300 rounded-md shadow-sm v focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full py-3 text-lg border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute w-6 h-6 text-gray-400 left-3 top-3" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full py-2 pl-12 pr-4 text-lg border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Today's Updates (Point-wise)
            </label>
            <textarea
              value={updateContent}
              onChange={handleTextareaChange}
              rows={6}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Press Enter to add a new numbered point automatically.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Update
          </button>
        </form>
      </div>

      {userUpdates.length > 0 && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Your Previous Updates</h2>
          <div className="space-y-4">
            {userUpdates.map((update) => (
              <div key={update.id} className="pb-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {update.date}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(update.submissionTime), 'HH:mm')}
                  </span>
                </div>
                <p className="text-gray-800 whitespace-pre-line">{update.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;