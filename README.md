# HireEva Application Documentation

## Overview

This project is a modern web application built with Next.js, featuring modular components, authentication, API routes, and integration with services like Supabase and Clerk. The structure is designed for scalability and maintainability.

## Features

- Modular UI components for rapid development
- Authentication flows (sign-in, sign-up)
- Dashboard, interview, and scheduling modules
- API endpoints for AI feedback, user management, and more
- Context and hooks for state management
- Asset-rich public directory for branding and UI

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Folder Structure

- `@/components/ui/` — Shared UI components (buttons, dialogs, etc.)
- `app/` — Main application logic, routes, and pages
- `components/ui/` — Additional UI components
- `context/` — React context providers for global state
- `hooks/` — Custom React hooks
- `lib/` — Utility functions and service clients
- `public/` — Static assets (images, SVGs, etc.)
- `services/` — Service layer for constants and Supabase client

## Customization

- Add or modify UI in `components/ui/` or `@/components/ui/`
- Add new pages or API endpoints in `app/`
- Update authentication logic in `app/(auth)/`
- Manage state with context in `context/` and hooks in `hooks/`

## Deployment

You can deploy this app to Vercel, Netlify, or any platform that supports Next.js. For production, set up environment variables and update your service configurations as needed.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)

## License

This project is licensed under the MIT License.
<<<<<<< HEAD

=======

```
ha/
├── @/
│ └── components/
│ └── ui/
│ ├── alert-dialog.jsx
│ ├── button.jsx
│ ├── card.jsx
│ ├── dialog.jsx
│ ├── label.jsx
│ ├── progress.jsx
│ ├── sonner.jsx
│ └── tabs.jsx
├── app/
│ ├── (auth)/
│ │ ├── sign-in/
│ │ └── sign-up/
│ ├── (main)/
│ │ ├── all-interview/
│ │ ├── dashboard/
│ │ ├── layout.jsx
│ │ ├── provider.jsx
│ │ ├── scheduled-interview/
│ │ ├── settings/
│ │ └── \_components/
│ ├── api/
│ │ ├── ai-feedback/
│ │ ├── aimodel/
│ │ └── users/
│ ├── auth/
│ │ ├── Footer.jsx
│ │ ├── Hero1.css
│ │ ├── Hero1.jsx
│ │ └── page.jsx
│ ├── favicon.png
│ ├── globals.css
│ ├── hooks/
│ │ └── user-mobile.jsx
│ ├── interview/
│ │ ├── layout.jsx
│ │ ├── [interview_id]/
│ │ └── \_components/
│ ├── layout.jsx
│ ├── not-found.jsx
│ ├── page.jsx
│ ├── provider.jsx
│ └── \_components/
├── components/
│ └── ui/
│ ├── 3d-card.jsx
│ ├── alert-dialog.jsx
│ ├── button.jsx
│ ├── card.jsx
│ ├── dialog.jsx
│ ├── input.jsx
│ ├── label.jsx
│ ├── progress.jsx
│ ├── select.jsx
│ ├── separator.jsx
│ ├── sheet.jsx
│ ├── sidebar.jsx
│ ├── skeleton.jsx
│ ├── sonner.jsx
│ ├── tabs.jsx
│ ├── textarea.jsx
│ └── tooltip.jsx
├── context/
│ ├── InterviewDataContext.jsx
│ └── userDetailsContext.jsx
├── hooks/
│ └── use-mobile.js
├── lib/
│ ├── getRandomGreeting.jsx
│ ├── supabase.jsx
│ └── utils.js
├── public/
│ ├── accenture_logo.png
│ ├── add_icon.svg
│ ├── adobe_logo.png
│ ├── amazon_logo.png
│ ├── app_main_img.png
│ ├── app_store.svg
│ ├── assets.js
│ ├── AvaLanding.svg
│ ├── Ava_favicon.png
│ ├── Ava_icon.svg
│ ├── Ava_icon128.svg
│ ├── Ava_icon48.svg
│ ├── Ava_icon_32.svg
│ ├── Ava_large.png
│ ├── Ava_large.svg
│ ├── back_arrow_icon.svg
│ ├── company_icon.svg
│ ├── cross_icon.svg
│ ├── delete_icon.svg
│ ├── edit_icon.svg
│ ├── email_icon.svg
│ ├── facebook_icon.svg
│ ├── file.svg
│ ├── globe.svg
│ ├── google.png
│ ├── home_icon.svg
│ ├── instagram_icon.svg
│ ├── interviews_image.jpg
│ ├── left_arrow_icon.svg
│ ├── location_icon.svg
│ ├── lock_icon.svg
│ ├── logo.png
│ ├── microsoft_logo.svg
│ ├── money_icon.svg
│ ├── next.svg
│ ├── person_icon.svg
│ ├── person_tick_icon.svg
│ ├── play_store.svg
│ ├── profile_img.png
│ ├── profile_upload_icon.svg
│ ├── resume_download_icon.svg
│ ├── resume_not_selected.svg
│ ├── resume_selected.svg
│ ├── right_arrow_icon.svg
│ ├── samsung_logo.png
│ ├── search_icon.svg
│ ├── suitcase_icon.svg
│ ├── twitter_icon.svg
│ ├── upload_area.svg
│ ├── vercel.svg
│ ├── walmart_logo.svg
│ └── window.svg
├── services/
  ├── constants.jsx
  └── supabaseClient.jsx
```
