/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/featrues/user/UserSlice';
import { FaClipboardList, FaSpinner, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import type { Task } from '@/featrues/task/taskApi';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import SpinningWheel from './SpinningWheel';
import TaskDetails from './TaskDetails';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.user);

  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [filterCategory, setFilterCategory] = useState<string>('family');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'spin' | 'details'>('tasks');

  const handleCancel = useCallback(() => {
    Swal.fire({
      title: 'Discard changes?',
      text: 'Unsaved task changes will be lost!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Discard',
    }).then((result) => {
      if (result.isConfirmed) {
        setShowForm(false);
        setEditingTask(null);
      }
    });
  }, []);

  const handleShowDetails = (task: Task) => {
    setSelectedTask(task);
    setActiveTab('details');
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
    setActiveTab('tasks');
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        Swal.fire('Logged out', 'You have been logged out successfully.', 'success');
        navigate('/login');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <header className="bg-[#0f172a] text-white rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-lg">Hi {user?.name || 'User'}</h2>
          <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <button
            onClick={() => {
              setActiveTab('tasks');
              Swal.fire('Task Tab Active', 'You are now viewing tasks.', 'info');
            }}
            className={`flex items-center gap-2 ${activeTab === 'tasks' ? 'text-green-400' : 'text-white'}`}
          >
            <FaClipboardList /> Task List
          </button>
          <button
            onClick={() => {
              setActiveTab('spin');
              Swal.fire('Spin Tab Active', 'Spin your task randomly!', 'info');
            }}
            className={`flex items-center gap-2 ${activeTab === 'spin' ? 'text-green-400' : 'text-white'}`}
          >
            <FaSpinner className="animate-spin" /> Spin
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:underline"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {activeTab === 'tasks' && (
        <>
          <div className="bg-white p-6 rounded-xl shadow-md my-6 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <label className="text-gray-600 text-sm block mb-1">Select Task Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border rounded px-4 py-2 w-52"
              >
                <option value="">All Categories</option>
                <option value="arts">Arts and Craft</option>
                <option value="nature">Nature</option>
                <option value="family">Family</option>
                <option value="sport">Sport</option>
                <option value="friends">Friends</option>
                <option value="meditation">Meditation</option>
              </select>
            </div>
            <div>
              <label className="text-gray-600 text-sm block mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded px-4 py-2 w-52"
              >
                <option value="all">All Task</option>
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="collaborative">Collaborative Task</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowForm(true);
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded flex items-center gap-2"
              >
                <FaPlus /> Add New Task
              </button>
            </div>
          </div>
          <TaskList
            onEdit={setEditingTask}
            onShowForm={setShowForm}
            filterStatus={filterStatus}
            filterCategory={filterCategory}
            onShowDetails={handleShowDetails}
          />
          {showForm && <TaskForm task={editingTask} onCancel={handleCancel} />}
        </>
      )}

      {activeTab === 'spin' && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
          <SpinningWheel />
        </div>
      )}

      {activeTab === 'details' && selectedTask && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
          <TaskDetails
            taskId={selectedTask._id}
            onEdit={(task) => {
              setEditingTask(task);
              setShowForm(true);
              setActiveTab('tasks');
            }}
            onShowForm={setShowForm}
            onClose={handleCloseDetails}
          />
          <button
            onClick={handleCloseDetails}
            className="mt-6 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
