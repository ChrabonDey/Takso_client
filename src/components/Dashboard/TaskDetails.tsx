import React from 'react';
import {
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  type Task
} from '@/featrues/task/taskApi';
import { FaCalendarAlt } from 'react-icons/fa';
import { BsFillCircleFill } from 'react-icons/bs';
import { BiCategory } from 'react-icons/bi';

interface TaskDetailsProps {
  taskId: string;
  onEdit: (task: Task) => void;
  onShowForm: (show: boolean) => void;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'todo':
      return 'text-pink-500';
    case 'in_progress':
      return 'text-yellow-500';
    case 'completed':
      return 'text-green-600';
    default:
      return 'text-gray-400';
  }
};

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onEdit, onShowForm, onClose }) => {
  const { data: task, isLoading, isError } = useGetTaskByIdQuery(taskId);
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      await deleteTask(taskId).unwrap();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'todo' | 'in_progress' | 'completed';
    try {
      await updateTask({ id: taskId, taskData: { status: newStatus } }).unwrap();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading task details...</p>;
  if (isError || !task) return <p className="text-center mt-10 text-red-500">Failed to load task.</p>;

  const statusColor = getStatusColor(task.status);

  return (
    <div className="bg-white shadow-lg p-6 rounded-2xl max-w-4xl mx-auto mt-10 border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Task Details</h2>
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md"
        >
          Close
        </button>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl text-green-700">
          <BiCategory />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{task.title}</h3>
          <p className="text-gray-600 mt-1 max-w-xl">{task.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-10 text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <FaCalendarAlt />
          <span className="text-sm">
            {task.createdAt
              ? new Date(task.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'N/A'}
          </span>
        </div>

        <div className={`flex items-center gap-2 text-lg font-medium ${statusColor}`}>
          <BsFillCircleFill className="text-sm" />
          <span className="capitalize">{task.status.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
          Change Status
        </label>
        <select
          id="status"
          value={task.status}
          onChange={handleStatusChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex justify-end mt-8 gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-100 text-red-700 hover:bg-red-200 px-5 py-2 rounded-md"
        >
          Delete Task
        </button>
        <button
          onClick={() => {
            onEdit(task);
            onShowForm(true);
            onClose();
          }}
          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-5 py-2 rounded-md"
        >
          Edit Task
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
