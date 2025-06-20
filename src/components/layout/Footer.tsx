import React from 'react';
import { CheckSquare, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A modern task management dashboard built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Product
            </h3>
            <div className="space-y-2">
              {['Features', 'Documentation', 'API Reference', 'Changelog'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Company
            </h3>
            <div className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex space-x-4">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 transform hover:scale-110"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © 2025 TaskFlow. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};