import { useState } from 'react';
import { ContentCard } from '../ContentCard';
import { mockContent } from '../../lib/mockData';
import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { toast } from 'sonner@2.0.3';

interface InstructorContentPageProps {
  onCreateContent: () => void;
  onEditContent: (id: string) => void;
}

export default function InstructorContentPage({ onCreateContent, onEditContent }: InstructorContentPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<{ id: string; title: string } | null>(null);
  
  // Filter out deleted items
  const content = mockContent.filter(item => !deletedIds.includes(item.id));

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    const item = mockContent.find(c => c.id === id);
    if (item) {
      setContentToDelete({ id, title: item.title });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (contentToDelete) {
      setDeletedIds([...deletedIds, contentToDelete.id]);
      toast.success('Content deleted successfully!', {
        description: 'The learning material has been removed.',
      });
      setContentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setContentToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">
            Manage Learning Content
          </h1>
          <p className="text-gray-600">
            Create, edit, and organize learning materials
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full lg:w-2/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search learning materials… (e.g., IELTS Reading, React Hooks, REST APIs)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button
            onClick={onCreateContent}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Learning Material
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              userRole="INSTRUCTOR"
              onEdit={onEditContent}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'No content matches your search.' : 'No content available.'}
            </p>
            {!searchQuery && (
              <Button
                onClick={onCreateContent}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Material
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onCreateContent}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Create new content"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={contentToDelete?.title || ''}
      />
    </div>
  );
}