import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Users, FileText, TrendingUp, Calendar, Clock, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task } from '../types';

export const Dashboard: React.FC = () => {
  const [tasks] = useLocalStorage<Task[]>('tasks', []);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setStats({ totalTasks, completedTasks, activeTasks, completionRate });
  }, [tasks]);

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const quickActions = [
    {
      title: 'Manage Tasks',
      description: 'Create, edit, and organize your tasks',
      icon: CheckSquare,
      href: '/tasks',
      color: 'from-primary-500 to-primary-600',
    },
    {
      title: 'View Users',
      description: 'Browse user profiles and information',
      icon: Users,
      href: '/users',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      title: 'Read Posts',
      description: 'Explore articles and blog posts',
      icon: FileText,
      href: '/posts',
      color: 'from-accent-500 to-accent-600',
    },
  ];

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900',
    },
    {
      title: 'Active Tasks',
      value: stats.activeTasks,
      icon: Clock,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100 dark:bg-accent-900',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: Star,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to TaskFlow
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your productivity dashboard for managing tasks and staying organized.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
              <p className="text-gray-600 dark:text-gray-400">Get started with these common tasks</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    to={action.href}
                    className="group block"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-200 dark:border-gray-600">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {action.description}
                      </p>
                      <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                        Get started
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <div>
          <Card className="animate-fade-in" style={{ animationDelay: '600ms' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
                <Link to="/tasks">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No tasks yet</p>
                  <Link to="/tasks">
                    <Button size="sm">Create your first task</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-secondary-500' : 'bg-accent-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};