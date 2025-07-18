# AgroPal Modern Dark Theme

This is a comprehensive theme system for the AgroPal application with a modern dark theme using green, black, and white colors.

## Theme Features

- 🌑 **Modern Dark Theme**: Professional dark theme with high contrast and vibrant accents
- 🎨 **Green, Black, and White Color Scheme**: Agriculture-focused color palette
- ✨ **Smooth Animations**: Page transitions, hover effects, and loading states
- 📱 **Fully Responsive**: Works seamlessly on all device sizes
- 🧩 **Reusable Components**: Modular design system with consistent styling

## Animation System

The theme includes a comprehensive animation system with:

- Page transitions
- Element entrance animations
- Hover effects
- Loading states
- Micro-interactions

## Using UI Components

### Buttons

```jsx
import { Button } from '../components/ui';

// Basic usage
<Button>Default Button</Button>

// With animation
<Button animate="ripple" color="primary">Animated Button</Button>

// Different variants
<Button variant="contained">Contained Button</Button>
<Button variant="outlined">Outlined Button</Button>
<Button variant="text">Text Button</Button>
```

### Cards

```jsx
import Card from '../components/ui/Card';

// Basic usage
<Card>
  <CardContent>Basic Card</CardContent>
</Card>

// With title and hover effect
<Card 
  title="Card Title" 
  subheader="Card Subheader"
  hoverEffect="lift"
>
  <CardContent>Card with hover effect</CardContent>
</Card>

// Different variants
<Card variant="gradient">Gradient Card</Card>
<Card variant="glass">Glass Card</Card>
<Card variant="outlined">Outlined Card</Card>
<Card variant="flat">Flat Card</Card>

// Loading state
<Card isLoading={true}>Loading Card</Card>
```

### Page Container

```jsx
import { PageContainer } from '../components/ui';

// Basic usage
<PageContainer>
  <Typography>Page content with animation</Typography>
</PageContainer>

// With delay
<PageContainer delay="0.3s">
  <Typography>Delayed entrance</Typography>
</PageContainer>
```

### Page Loader

```jsx
import { PageLoader } from '../components/ui';

// Basic usage
<PageLoader />

// With custom message
<PageLoader message="Loading weather data..." />

// Full screen loader
<PageLoader fullScreen={true} />
```

## Theme Colors

- **Primary**: Green shades (#4CAF50, #81C784, #2E7D32)
- **Secondary**: Grayscale (#E0E0E0, #FFFFFF, #BDBDBD)
- **Background**: Dark shades (#121212, #1E1E1E)
- **Text**: White and light gray (#FFFFFF, #B0B0B0)

## Best Practices

1. Use consistent spacing with theme spacing units (`theme.spacing()`)
2. Leverage the animation system for smoother transitions
3. Use appropriate card variants based on content importance
4. Apply hover effects to interactive elements
5. Use the PageContainer for consistent page transitions

## Adding New Components

When creating new components, follow these guidelines:

1. Use styled components with theme access
2. Include appropriate animations
3. Ensure dark theme compatibility
4. Make components responsive
5. Add to the UI components barrel file for easy import
