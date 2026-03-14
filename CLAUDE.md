# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VitePress-based documentation site for frontend learning notes. It contains tutorials, interview questions, and notes covering Vue, React, JavaScript, algorithms, webpack, and more.

## Commands

```bash
# Start development server
yarn docs:dev

# Build for production
yarn docs:build

# Serve the built site locally
yarn docs:serve
```

Note: Uses `yarn` as package manager. Requires Node.js 18.x.

## Architecture

- **Content Structure**:
  - `/docs/study/` - Main learning notes organized by topic (Vue2/3, React, JavaScript, CSS, Webpack, Algorithms, Micro-frontends, etc.)
  - `/docs/notes/days/` - Daily learning notes with date-based filenames
  - `/docs/leetcode/` - LeetCode algorithm solutions

- **Configuration**: `/docs/.vitepress/config.js` - Contains all sidebar navigation, site title, and plugin configurations

- **Base Path**: `/doc/` (configured for deployment to nginx subdirectory)

## Key Features

- Mermaid diagram support via `vitepress-plugin-mermaid`
- Search functionality via `vitepress-plugin-search`
- Custom Vue components in `/docs/components/`

## Deployment

GitHub Actions workflow (`.github/workflows/ci.yml`) automatically builds and deploys to Aliyun ECS on push to main branch. Build output is in `docs/.vitepress/dist/`.
