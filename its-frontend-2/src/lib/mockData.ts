import { ContentItem } from '../components/ContentCard';

export const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    contentType: 'TEXT',
    content: 'React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and have become the standard way to write React components. The most commonly used hooks are useState and useEffect, which allow you to add state and side effects to functional components.',
    topic: 'reading-1',
    published: true,
    createdBy: 'cde@example.com',
    createdDate: 'Nov 25, 2025',
  },
  {
    id: '2',
    title: 'Understanding JavaScript Promises',
    contentType: 'VIDEO',
    content: 'This comprehensive video tutorial covers JavaScript Promises from basics to advanced concepts. Learn how to handle asynchronous operations, chain promises, and use async/await syntax effectively in your applications.',
    topic: 'reading-2',
    published: true,
    createdBy: 'instructor@example.com',
    createdDate: 'Nov 20, 2025',
  },
  {
    id: '3',
    title: 'CSS Flexbox Interactive Exercise',
    contentType: 'INTERACTIVE_EXERCISE',
    content: 'Master CSS Flexbox through hands-on interactive exercises. Learn about flex containers, flex items, alignment, justification, and responsive layouts. Complete practical challenges to reinforce your understanding.',
    topic: 'reading-3',
    published: true,
    createdBy: 'cde@example.com',
    createdDate: 'Nov 18, 2025',
  },
  {
    id: '4',
    title: 'IELTS Reading Sample',
    contentType: 'TEXT',
    content: 'This is a sample reading material for IELTS.',
    topic: 'reading-1',
    published: true,
    createdBy: 'cde@example.com',
    createdDate: 'Nov 25, 2025',
  },
  {
    id: '5',
    title: 'Building RESTful APIs',
    contentType: 'VIDEO',
    content: 'Learn how to design and build RESTful APIs following industry best practices. Topics include HTTP methods, status codes, authentication, versioning, and documentation.',
    topic: 'reading-4',
    published: true,
    createdBy: 'instructor@example.com',
    createdDate: 'Nov 15, 2025',
  },
  {
    id: '6',
    title: 'Git Version Control Practice',
    contentType: 'INTERACTIVE_EXERCISE',
    content: 'Practice essential Git commands and workflows through interactive scenarios. Learn branching, merging, resolving conflicts, and collaborating with teams using Git.',
    topic: 'reading-5',
    published: false,
    createdBy: 'cde@example.com',
    createdDate: 'Nov 10, 2025',
  },
];

export const getContentById = (id: string): ContentItem | undefined => {
  return mockContent.find(item => item.id === id);
};

export const getStudentContent = (): ContentItem[] => {
  return mockContent.filter(item => item.published);
};

export const getInstructorContent = (): ContentItem[] => {
  // Return all content for the instructor view
  // In a real app, this would filter by the logged-in instructor's ID
  return mockContent;
};