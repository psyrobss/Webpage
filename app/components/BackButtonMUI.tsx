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
      variant="contained" // Or "pill" if you have a custom variant registered
      color="primary" 
      size="medium" // Changed from 'large' to 'medium' or 'small' for a corner button
      startIcon={<ArrowBackIcon />} // Use startIcon for a left arrow
      onClick={handleBackClick}
      aria-label="Voltar para a página inicial" // Accessibility
      title="Voltar para a página inicial" // Tooltip
      // Add styling for positioning and pill shape if 'pill' is not a custom variant
      sx={{
        position: 'absolute', // Position it relative to its closest positioned ancestor
        top: 20, // Distance from the top (adjust as needed)
        left: 20, // Distance from the left (adjust as needed)
        zIndex: 10, // Ensure it's above other content
        // If 'variant="pill"' doesn't work directly, use this for pill shape:
        // borderRadius: 9999, 
        
        // Inherit hover effect from the example, adjust if needed
        '&:hover': { 
            transform: 'scale(1.05)',
            // Also maybe adjust background/color on hover if needed
            backgroundColor: theme => theme.palette.secondary.dark,
        },
        transition: 'transform 0.2s ease-out',

        // Removed minWidth: '200px' as it's too wide for a back button
      }}
    >
      Voltar
    </Button>
  );
}