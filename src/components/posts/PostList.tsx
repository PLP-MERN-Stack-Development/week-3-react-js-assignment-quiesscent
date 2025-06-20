import React, { useState, useEffect } from 'react';
import { Post, User } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Search, User as UserIcon, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const postsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [postsResponse, usersResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users')
        ]);

        if (!postsResponse.ok || !usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [postsData, usersData] = await Promise.all([
          postsResponse.json(),
          usersResponse.json()
        ]);

        setPosts(postsData);
        setUsers(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserById = (userId: number) => {
    return users.find(user => user.id === userId);
  };

  const filteredPosts = posts.filter(post => {
    const user = getUserById(post.userId);
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const toggleExpanded = (postId: number) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Posts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredPosts.length} posts found
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
        />
      </div>

      {/* Posts List */}
      {paginatedPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <Search className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {paginatedPosts.map((post) => {
            const user = getUserById(post.userId);
            const isExpanded = expandedPosts.has(post.id);
            const truncatedBody = post.body.length > 150 ? post.body.substring(0, 150) + '...' : post.body;
            
            return (
              <Card key={post.id} className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize mb-2">
                        {post.title}
                      </h3>
                      {user && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <span>{user.name}</span>
                          <span className="text-gray-400">•</span>
                          <span>@{user.username}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      #{post.id}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {isExpanded ? post.body : truncatedBody}
                  </p>
                  {post.body.length > 150 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(post.id)}
                      className="text-xs"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 mr-1" />
                          Read More
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};