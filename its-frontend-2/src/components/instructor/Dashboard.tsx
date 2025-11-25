import { HeroSection } from '../HeroSection';

interface InstructorDashboardProps {
  userName: string;
  onNavigateToContent: () => void;
}

export default function InstructorDashboard({ userName, onNavigateToContent }: InstructorDashboardProps) {
  return (
    <HeroSection 
      variant="instructor" 
      userName={userName} 
      onButtonClick={onNavigateToContent}
    />
  );
}
