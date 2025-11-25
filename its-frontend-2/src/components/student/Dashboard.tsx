import { HeroSection } from '../HeroSection';

interface StudentDashboardProps {
  userName: string;
  onNavigateToContent: () => void;
}

export default function StudentDashboard({ userName, onNavigateToContent }: StudentDashboardProps) {
  return (
    <HeroSection 
      variant="student" 
      userName={userName} 
      onButtonClick={onNavigateToContent}
    />
  );
}
