import Navbar from './Navbar';
import { useLocation } from '@tanstack/react-router';

export default function Header() {
  const location = useLocation();

  // Don't show header on auth pages
  if (location.pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <header>
      <Navbar />
    </header>
  );
}
