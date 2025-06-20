import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle2, Circle, Trash2, AlertCircle, Clock, Zap } from 'lucide-react';
import { Task, TaskFilter } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority']
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      createdAt: new Date(),
      priority: newTask.priority,
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', description: '', priority: 'medium' });
    setIsAddingTask(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'completed' && task.completed) || 
      (filter === 'active' && !task.completed);
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Zap className="w-4 h-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {activeCount} active, {completedCount} completed
          </p>
        </div>
        <Button onClick={() => setIsAddingTask(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <Card className="animate-slide-up">
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Task Title"
                placeholder="Enter task title..."
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input
                label="Description (optional)"
                placeholder="Enter task description..."
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div className="flex space-x-2">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setNewTask(prev => ({ ...prev, priority }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        newTask.priority === priority
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-2 border-primary-500'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {getPriorityIcon(priority)}
                      <span className="ml-1 capitalize">{priority}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={addTask} disabled={!newTask.title.trim()}>
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
          />
        </div>
        <div className="flex space-x-2">
          {(['all', 'active', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === filterType
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4 mr-1 inline" />
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {tasks.length === 0 
                  ? 'Create your first task to get started!' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className={`border-l-4 ${getPriorityColor(task.priority)} transition-all duration-200 hover:shadow-lg animate-fade-in`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-secondary-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      {getPriorityIcon(task.priority)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};