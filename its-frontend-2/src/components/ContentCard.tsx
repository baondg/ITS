import { FileText, Video, Zap } from 'lucide-react';
import { ViewButton } from './ViewButton';
import { EditButton } from './EditButton';
import { DeleteButton } from './DeleteButton';

export interface ContentItem {
  id: string;
  title: string;
  contentType: 'TEXT' | 'VIDEO' | 'INTERACTIVE_EXERCISE';
  content: string;
  topic: string;
  published: boolean;
  createdBy: string;
  createdDate: string;
}

interface ContentCardProps {
  content: ContentItem;
  userRole: 'STUDENT' | 'INSTRUCTOR';
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ContentCard({ content, userRole, onView, onEdit, onDelete }: ContentCardProps) {
  const getTypeIcon = () => {
    switch (content.contentType) {
      case 'TEXT':
        return <FileText className="w-4 h-4" />;
      case 'VIDEO':
        return <Video className="w-4 h-4" />;
      case 'INTERACTIVE_EXERCISE':
        return <Zap className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = () => {
    switch (content.contentType) {
      case 'TEXT':
        return 'bg-blue-100 text-blue-700';
      case 'VIDEO':
        return 'bg-purple-100 text-purple-700';
      case 'INTERACTIVE_EXERCISE':
        return 'bg-teal-100 text-teal-700';
    }
  };

  const getTypeLabel = () => {
    switch (content.contentType) {
      case 'TEXT':
        return 'Text';
      case 'VIDEO':
        return 'Video';
      case 'INTERACTIVE_EXERCISE':
        return 'Interactive';
    }
  };

  const truncateContent = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-gray-900 flex-1 line-clamp-2">
            {content.title}
          </h3>
          {!content.published && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs whitespace-nowrap">
              Draft
            </span>
          )}
        </div>

        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${getTypeBadgeColor()}`}>
            {getTypeIcon()}
            <span className="text-xs">{getTypeLabel()}</span>
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            {content.topic}
          </span>
        </div>

        {/* Content Preview */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {truncateContent(content.content)}
        </p>

        {/* Metadata */}
        <div className="text-gray-500 mb-4 border-t border-gray-100 pt-3">
          <p>Created {content.createdDate}</p>
        </div>

        {/* Actions - Always at bottom with consistent height */}
        <div className="flex items-center gap-2 mt-auto">
          {userRole === 'STUDENT' && (
            <ViewButton onClick={() => onView?.(content.id)} />
          )}

          {userRole === 'INSTRUCTOR' && (
            <>
              <EditButton onClick={() => onEdit?.(content.id)} />
              <DeleteButton onClick={() => onDelete?.(content.id)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}