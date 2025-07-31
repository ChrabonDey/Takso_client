import { useGetTasksQuery, type Task } from '@/featrues/task/taskApi';
import { useState } from 'react';


const SpinningWheel: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const { data: tasks = [] } = useGetTasksQuery({});

  const spinWheel = () => {
    if (tasks.length === 0) return;
    setIsSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * tasks.length);
      setSelectedTask(tasks[randomIndex]);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="mb-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Spin to Choose a Task!</h2>
      <div
        className={`w-64 h-64 mx-auto rounded-full bg-blue-200 flex items-center justify-center transition-transform duration-2000 ${isSpinning ? 'animate-spin' : ''}`}
      >
        {selectedTask ? (
          <div className="text-center">
            <p className="font-bold">{selectedTask.title}</p>
            <p>{selectedTask.category.replace('_', ' ')}</p>
          </div>
        ) : (
          <p>Click to Spin!</p>
        )}
      </div>
      <button
        onClick={spinWheel}
        disabled={isSpinning || tasks.length === 0}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {isSpinning ? 'Spinning...' : 'Spin Wheel'}
      </button>
    </div>
  );
};

export default SpinningWheel;
