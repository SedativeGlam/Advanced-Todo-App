# Advanced Todo App with Theme Switcher

A feature-rich React Native todo application built with Expo, featuring real-time synchronization via Convex, dark/light theme switching, and comprehensive CRUD operations.

## Features

**Theme Switcher**
- Light and dark themes with smooth transitions
- Persistent theme preference across app restarts
- Animated theme transitions

**Real-time CRUD Operations**
- Create todos with title, description, and due date
- Read and display todos in real-time
- Update todos with inline editing
- Delete todos with confirmation
- Toggle todo completion status

**Advanced UI/UX**
- Filter todos (All/Active/Completed)
- Empty states for different filters
- Responsive design for all screen sizes
- Accessibility compliant

**Data Management**
- Real-time sync via Convex
- Persistent storage
- Order management for todos
- Clear completed todos functionality

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Convex** for real-time backend
- **AsyncStorage** for theme persistence
- **React Native Reanimated** for smooth animations
- **React Native Gesture Handler** for gestures

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Expo CLI installed globally (`npm install -g expo-cli`)
- Convex CLI installed globally (`npm install -g convex`)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd todo-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Convex

1. Create a Convex account at [convex.dev](https://convex.dev)
2. Initialize Convex in your project:
```bash
npx convex dev
```

3. This will:
   - Create a new Convex project
   - Generate a deployment URL
   - Set up the schema and functions
   - Start the dev server

4. Copy your Convex deployment URL

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:
```bash
EXPO_PUBLIC_CONVEX_URL=https://your-deployment-url.convex.cloud
```

Replace `your-deployment-url` with your actual Convex deployment URL from step 3.

### 5. Run the Development Server
```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

## Build Commands

### Android APK Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS build
eas build:configure

# Build APK for Android
eas build --platform android --profile preview
```

### iOS Build
```bash
# Build for iOS
eas build --platform ios --profile preview
```

### Production Builds
```bash
# Android Production
eas build --platform android --profile production

# iOS Production
eas build --platform ios --profile production
```

## Project Structure
```
todo-app/
├── app/
│   ├── _layout.tsx          # Root layout with providers
│   └── index.tsx            # Main todo screen
├── components/
│   ├── ThemeProvider.tsx    # Theme context provider
│   ├── TodoItem.tsx         # Individual todo item component
│   └── EmptyState.tsx       # Empty state component
├── hooks/
│   ├── useTheme.ts          # Theme hook
│   └── useThemeColors.ts    # Theme colors hook
├── constants/
│   └── Colors.ts            # Color definitions
├── types/
│   └── todo.ts              # TypeScript types
├── convex/
│   ├── schema.ts            # Database schema
│   ├── todos.ts             # Todo CRUD functions
│   └── _generated/          # Auto-generated Convex files
├── .env.local               # Environment variables
└── README.md                # This file
```

## Convex Setup Steps (Detailed)

### 1. Initial Setup
```bash
# Install Convex
npm install convex

# Initialize Convex
npx convex dev
```

### 2. Deploy Functions

Convex automatically deploys your functions when you run `npx convex dev`. The functions are defined in:

- `convex/schema.ts` - Database schema
- `convex/todos.ts` - CRUD operations

### 3. Monitor Convex Dashboard

Visit your Convex dashboard at `https://dashboard.convex.dev` to:
- View real-time data
- Monitor function calls
- Debug issues
- Manage deployments

### 4. Production Deployment
```bash
# Deploy to production
npx convex deploy
```

## Environment Variables Configuration

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_CONVEX_URL` | Your Convex deployment URL | `https://xxx.convex.cloud` |

## Features Implementation

### Theme Switching
- Uses React Context for global state
- AsyncStorage for persistence
- Animated transitions with React Native Reanimated

## Accessibility Features

- Proper accessibility labels
- High contrast ratios (WCAG AA compliant)
- Screen reader support
- Touch target sizes (44x44 minimum)
- Semantic HTML structure

## Testing

### Manual Testing Checklist

- [ ] Create todo with all fields
- [ ] Create todo with only title
- [ ] Edit existing todo
- [ ] Toggle todo completion
- [ ] Delete todo
- [ ] Search todos
- [ ] Filter todos (All/Active/Completed)
- [ ] Switch themes
- [ ] Test theme persistence after restart
- [ ] Test on different screen sizes
- [ ] Test offline behavior

### Running the App

1. Start Convex dev server:
```bash
npx convex dev
```

2. In a new terminal, start Expo:
```bash
npx expo start
```

## Troubleshooting

### Convex Connection Issues

If you see connection errors:
1. Verify your `.env.local` has the correct `EXPO_PUBLIC_CONVEX_URL`
2. Ensure `npx convex dev` is running
3. Check your internet connection
4. Restart both Convex and Expo servers

### Theme Not Persisting

1. Clear app data/cache
2. Verify AsyncStorage is installed correctly
3. Check for errors in console

### Build Failures

1. Clear cache: `npx expo start -c`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check EAS build logs for specific errors

## Performance Optimization

- Memoized filtered todos with `useMemo`
- Optimistic UI updates
- Efficient re-rendering with React.memo
- Lazy loading for large todo lists
- Debounced search input