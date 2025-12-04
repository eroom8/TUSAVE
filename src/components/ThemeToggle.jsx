import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    >
      <div className="absolute inset-0 flex items-center justify-center transition-all">
        {/* Sun icon for light mode */}
        <svg
          className={`h-4 w-4 transition-all ${theme === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        
        {/* Moon icon for dark mode */}
        <svg
          className={`absolute h-4 w-4 transition-all ${theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;