import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { getContentById } from '../../lib/mockData';
import { toast } from 'sonner';
import { fetchWithAuth } from '../../lib/api';

interface ContentFormProps {
  contentId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function ContentForm({ contentId, onSave, onCancel }: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'TEXT' as 'TEXT' | 'VIDEO' | 'INTERACTIVE_EXERCISE',
    content: '',
    topic: '',
    published: false,
  });

  useEffect(() => {
    if (!contentId) return;
    const fetchContent = async () => {
      try {
        const res = await fetchWithAuth(`http://localhost:8080/api/content/${contentId}`);

        if (!res.ok) throw new Error("Failed to load content");

        const data = await res.json();

        console.log("EDIT FORM LOAD >>>", data);

        setFormData({
          title: data.title,
          contentType: data.type,
          content: data.content,
          topic: data.topicId,
          published: data.published,
        });
      } catch (err) {
          toast.error("Failed to load content", { description: err.message });
      }
    };

    fetchContent();
  }, [contentId]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const payload = {
        title: formData.title,
        type: formData.contentType,
        content: formData.content,
        topicId: formData.topic,
        published: formData.published,
      };
        console.log("PAYLOAD SENT >>>", payload);


      try {
        let url = "http://localhost:8080/api/content";
        let method = "POST";

        if (contentId) {
          url = `http://localhost:8080/api/content/${contentId}`;
          method = "PUT";
        }

        const res = await fetchWithAuth(url, {
          method,
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Request failed");
        }

        if (contentId) {
          toast.success("Content updated successfully!", {
            description: "Your learning material has been updated.",
          });
        } else {
          toast.success("Content created successfully!", {
            description: "Your learning material has been saved.",
          });
        }

        onSave();
      } catch (err: any) {
        toast.error("Failed to save content", {
          description: err.message,
        });
      }
    };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">
            {contentId ? 'Update Learning Material' : 'Create New Learning Material'}
          </h1>
          <p className="text-gray-600">
            {contentId ? 'Edit the details of your learning material' : 'Add a new learning material for students'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter content title"
              required
            />
          </div>

          {/* Content Type and Topic - Two Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type *</Label>
              <Select
                value={formData.contentType}
                onValueChange={(value: any) => setFormData({ ...formData, contentType: value })}
              >
                <SelectTrigger id="contentType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="INTERACTIVE_EXERCISE">Interactive Exercise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., React, JavaScript, CSS"
                required
              />
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter the main content here..."
              rows={12}
              required
            />
            <p className="text-gray-500">Provide detailed information about the learning material</p>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="published" className="cursor-pointer">Publish Content</Label>
              <p className="text-gray-500">Make this content visible to students</p>
            </div>
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            >
              {contentId ? 'Update Content' : 'Save Content'}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}