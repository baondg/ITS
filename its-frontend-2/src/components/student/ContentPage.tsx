import { useState, useEffect } from 'react';
import { ContentCard } from '../ContentCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { fetchWithAuth } from '../../lib/api';


interface ContentItem {
  id: string;
  title: string;
  content: string;
  topic: string;
  contentType: 'TEXT' | 'VIDEO' | 'INTERACTIVE_EXERCISE';
  createdBy: string;
  createdDate: string;
}
export default function StudentContentPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);


    useEffect(() => {
      const fetchContents = async () => {
        setLoading(true);
        try {
          const res = await fetchWithAuth('http://localhost:8080/api/content');

          if (!res.ok) throw new Error('Failed to fetch contents');

          const data = await res.json();

          const mapped = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            topic: item.topicId,
            contentType: item.type,
            createdBy: item.createdBy,
            createdDate: item.createdDate,
            published: item.published,
          }));

          setContents(mapped.filter(item => item.published === true));
        } catch (err: any) {
          toast.error('Failed to load content', { description: err.message });
        } finally {
          setLoading(false);
        }
      };

      fetchContents();
    }, []);

    const filteredContent = contents.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleViewContent = (id: string) => {
    const item = filteredContent.find(c => c.id === id);
    setSelectedContent(item);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">
            Learning Content
          </h1>
          <p className="text-gray-600">
            Browse all available learning materials
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-2/3 mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search learning materials… (e.g., IELTS Reading, React Hooks, REST APIs)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              userRole="STUDENT"
              onView={handleViewContent}
            />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No matching content found.</p>
          </div>
        )}
      </div>

      {/* Content Detail Modal */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" aria-describedby={undefined}>
          {selectedContent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedContent.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Type & Topic Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {selectedContent.contentType.replace('_', ' ')}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    Topic: {selectedContent.topic}
                  </span>
                </div>

                {/* Metadata */}
                <div className="text-gray-600 space-y-1 border-t border-gray-200 pt-4">
                  <p>Created by: {selectedContent.createdBy}</p>
                  <p>Created: {selectedContent.createdDate}</p>
                </div>

                {/* Content Body */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedContent.content}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}