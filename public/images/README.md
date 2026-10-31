# Images

Drop real photography here and reference it from the content files; no layout changes are needed.

Example, in `src/content/services.ts`:

```ts
image: { src: '/images/home-nursing.jpg', alt: 'A nurse assisting an elderly man', ratio: '4 / 3', width: 1200, height: 900 }
```

- Keep the `ratio` the same as the placeholder so the layout does not shift.
- The pixel `width` × `height` shown on each placeholder is the recommended size for the final asset.
- Export JPG/WebP at roughly that size (well under 300 KB each) for good performance.
- Always write meaningful `alt` text describing the photo (not "image of…").
