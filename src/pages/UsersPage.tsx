import React from 'react';
import { UserList } from '../components/users/UserList';

export const UsersPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserList />
    </div>
  );
};