# Fanghan portfolio

React + TypeScript + Tailwind + Framer Motion.

## Run
pnpm install
pnpm dev
pnpm build

## Image replacement
Image slots are defined in src/main.tsx in the slots map, with photo collections in src/Media.tsx. Keep web images under public/images and set the matching src to /images/filename.webp. Empty src renders the labeled placeholder.

- hero-portrait: transparent portrait
- gallery-01 through gallery-20: two-row personal photo gallery
- about-music, about-research, about-community, about-moon: transparent decoration
- herline-01, herline-02, herline-main
- research-01, research-02, research-main
- music-01, music-02, music-main

The corresponding project dialog reuses each main image. No sample third-party photographs are used. Herline is described as a concept pending further supplied evidence.

Personal photo originals live in asset/personal. Run `python scripts/prepare-personal-photos.py` (requires Pillow) after updating its photo list to generate web-sized WebP copies and src/personal-photos.json. Original images are left untouched. Both gallery rows use the shared click-to-enlarge viewer; their scroll movement adapts to the viewport and row width. Reduced-motion visitors can scroll each row horizontally.

## Project films

`src/ProjectVideo.tsx` maps the community film (`222_25MB.mp4`) to Education & Care and the music film (`111_25MB.mp4`) to Beyond the Notes. Web copies and poster frames live in `public/videos/`. The web copies use H.264/AAC, 720p, and fast-start metadata, with each MP4 below 25 MiB. The originals remain in the parent workspace.

Both project cards and project dialogs include native video controls and inline mobile playback. Videos retain their aspect ratios, load on demand (`preload="none"`), and do not autoplay. Starting a film pauses other players; opening a project dialog pauses the page players. Existing subtitles are embedded in the supplied footage.
