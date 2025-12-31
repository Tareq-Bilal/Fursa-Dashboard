# Public Assets

This folder contains static assets that are served directly by Next.js.

## Structure

- `/images` - Images (logos, banners, photos, etc.)
- `/icons` - Icon files (favicon, app icons, etc.)

## Usage

Files in the `public` directory can be referenced from the root of your application:

```tsx
// Example: Accessing an image
<Image src="/images/logo.png" alt="Logo" width={200} height={50} />

// Example: Accessing an icon
<link rel="icon" href="/icons/favicon.ico" />
```

## Best Practices

- Use descriptive filenames
- Optimize images before adding them
- Consider using WebP format for better performance
- Keep file sizes small
