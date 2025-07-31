import React from 'react';
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  type Task
} from '@/featrues/task/taskApi';
import { FaTrashAlt, FaCalendarAlt } from 'react-icons/fa';
import { BsFillCircleFill } from 'react-icons/bs';
import { BiCategory } from 'react-icons/bi';

interface TaskListProps {
  onEdit: (task: Task) => void;
  onShowForm: (show: boolean) => void;
  filterStatus: string;
  filterCategory: string;
  onShowDetails: (task: Task) => void;  // required prop now
}

const TaskList: React.FC<TaskListProps> = ({
  onEdit,
  onShowForm,
  filterStatus,
  filterCategory,
  onShowDetails,
}) => {
  const { data: tasks = [], isLoading, isError } = useGetTasksQuery({
    status: filterStatus,
    category: filterCategory
  });

  const [deleteTask] = useDeleteTaskMutation();

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      await deleteTask(taskId).unwrap();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Failed to load tasks.</p>;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-pink-500';
      case 'done':
        return 'text-green-500';
      case 'ongoing':
        return 'text-yellow-500';
      case 'in_progress':
        return 'text-yellow-500';
      case 'completed':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {tasks.map((task) => {
        const statusColor = getStatusColor(task.status);

        return (
          <div
            key={task._id}
            className="relative bg-white p-5 rounded-xl shadow-md"
          >
            <button
              onClick={() => handleDelete(task._id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-lg text-green-800">
                <BiCategory />
              </div>
              <h3
                className="text-xl font-bold text-gray-800 cursor-pointer"
                onClick={() => onShowDetails(task)}
              >
                {task.title}
              </h3>
            </div>

            <p className="text-gray-500 text-sm mb-4">{task.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className={`flex items-center gap-1 ${statusColor}`}>
                <BsFillCircleFill className="text-xs" />
                <span className="font-semibold capitalize">{task.status}</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => {
                  onEdit(task);
                  onShowForm(true);
                }}
                className="text-yellow-600 hover:underline text-sm"
              >
                Edit Task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
