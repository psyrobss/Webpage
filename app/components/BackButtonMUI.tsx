// app/conceitos/components/BackButtonMUI.tsx
'use client'; // <--- This directive makes it a Client Component

import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the back arrow icon

export default function BackButtonMUI() {
  const router = useRouter();

  const handleBackClick = () => {
    // Navigate to the home page (assuming home is '/')
    router.push('/');
  };

  return (
    // You can wrap in Box for positioning, or apply positioning sx directly to Button

    <Button
      variant="contained" 
      color="primary" 
      size="small" // Changed from 'large' to 'medium' or 'small' for a corner button
      startIcon={<ArrowBackIcon />} // Use startIcon for a left arrow
      onClick={handleBackClick}
      aria-label="Voltar para a página inicial" // Accessibility
      title="Voltar para a página inicial" // Tooltip
      // Add styling for positioning and pill shape if 'pill' is not a custom variant
      sx={{
        position: 'relative', // Position it relative to its closest positioned ancestor
        top: 20, // Distance from the top (adjust as needed)
        left: 20, // Distance from the left (adjust as needed)
        zIndex: 3, // Ensure it's above other content
        '&:hover': { 
            transform: 'scale(1.05)',
            backgroundColor: theme => theme.palette.secondary.dark,
        },
        transition: 'transform 0.2s ease-out',

      }}
    >
    
    </Button>
  );
}