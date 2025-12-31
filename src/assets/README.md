# Source Assets

This folder contains assets that are imported directly into your components.

## Structure

- `/icons` - SVG icons or icon components
- `/constants` - Application constants and configuration

## Usage

```tsx
// Example: Importing constants
import { APP_NAME, ROUTES } from "@/assets/constants";

// Example: Importing an icon component
import { CustomIcon } from "@/assets/icons/CustomIcon";
```

## Best Practices

- Use TypeScript for type safety
- Export constants as `const` assertions for better type inference
- Keep related constants grouped together
- Use meaningful names
