# Drawing Feature Implementation Guide

## Overview

This document explains how the drawing feature was implemented and how it integrates with the existing codebase. The implementation follows a modular architecture that makes it easy for team members to add new activity types.

## Step-by-Step Implementation Process

### Step 1: Refactored Activity System
**What was done:**
- Converted the hardcoded quiz into a configurable activity system
- Created an `ACTIVITY_TYPES` array that defines all available activities
- Each activity has a `type`, `name`, and `handler` function

**Why this approach:**
- Makes it easy to add new activity types without modifying core logic
- Keeps the code organized and maintainable
- Allows random selection between different activities

### Step 2: Drawing Canvas Implementation
**What was done:**
- Added HTML5 `<canvas>` element (500x400 pixels)
- Implemented mouse and touch event handlers for drawing
- Added coordinate transformation to handle canvas scaling
- Set up drawing context with appropriate stroke settings

**Key features:**
- Supports both mouse and trackpad input
- Touch support for mobile devices
- Smooth line drawing with rounded line caps
- White background with black drawing strokes

### Step 3: Timer System
**What was done:**
- Implemented a 60-second countdown timer
- Timer displays remaining seconds in real-time
- When timer reaches 0, it shows "Time's up!" and displays the resume button

**Implementation details:**
- Uses `setInterval` to update every second
- Timer is displayed prominently above the canvas
- Automatically stops when time expires

### Step 4: Prompt System
**What was done:**
- Created `DRAWING_PROMPTS` array with various drawing prompts
- Randomly selects a prompt when drawing activity starts
- Prompt is displayed above the timer

**Example prompts:**
- "Take 60 seconds and draw a flower"
- "Take 60 seconds and draw a tree"
- "Take 60 seconds and draw a house"

### Step 5: Resume Functionality
**What was done:**
- Resume button appears after timer expires
- Button is hidden during the drawing period
- Clicking resume unlocks the screen and resets the timer

### Step 6: Styling
**What was done:**
- Added CSS for drawing activity container
- Styled canvas with border and rounded corners
- Added clear button styling
- Made the drawing box larger (600px max-width) to accommodate canvas

## Code Structure

### Main Components

1. **Activity Configuration** (`ACTIVITY_TYPES` array)
   - Central registry of all activities
   - Easy to add new types

2. **Activity Handlers**
   - `createQuizActivity()` - Original quiz functionality
   - `createDrawingActivity()` - New drawing functionality
   - Each handler receives the overlay element and builds its UI

3. **Core Functions**
   - `lockScreen()` - Randomly selects and displays an activity
   - `unlockScreen()` - Removes overlay and resets timer
   - Timer management functions

## How to Merge with Team Work

### 1. **Use Feature Branches**
```bash
git checkout -b feature/drawing-activity
# Make your changes
git commit -m "Add drawing activity feature"
git push origin feature/drawing-activity
```

### 2. **Code Organization for Team Collaboration**

The code is structured to minimize merge conflicts:

- **Activity handlers are separate functions** - Team members can add new handlers without touching existing ones
- **Configuration arrays** - Easy to add new items without conflicts
- **Modular structure** - Each activity is self-contained

### 3. **Adding New Activity Types (Team-Friendly)**

To add a new activity type, team members only need to:

1. **Add to ACTIVITY_TYPES array:**
```javascript
const ACTIVITY_TYPES = [
    // ... existing activities
    {
        type: 'breathing',
        name: 'Breathing Exercise',
        handler: createBreathingActivity
    }
];
```

2. **Create the handler function:**
```javascript
function createBreathingActivity(overlay) {
    overlay.innerHTML = `
        <div id="insta-focus-box">
            <!-- Your activity HTML here -->
        </div>
    `;
    // Add event listeners and logic
}
```

3. **Add any necessary CSS** (if needed)

### 4. **Avoiding Merge Conflicts**

**Best practices:**
- Each team member should work on different activity types
- Use descriptive function names (e.g., `createBreathingActivity`, not `createActivity3`)
- Keep activity handlers in separate sections with clear comments
- Don't modify the core `lockScreen()` or `unlockScreen()` functions unless necessary

### 5. **Testing Before Merging**

Before merging:
1. Test that existing activities still work
2. Test that new activity appears randomly
3. Test that unlock/resume functionality works
4. Test on different screen sizes

## File Changes Summary

### `content.js`
- **Added:** Activity configuration system
- **Added:** `createDrawingActivity()` function
- **Refactored:** `lockScreen()` to support multiple activity types
- **Added:** Drawing prompts array
- **Added:** Canvas drawing logic with mouse/touch support
- **Added:** 60-second timer implementation

### `style.css`
- **Added:** `.drawing-activity` class styles
- **Added:** Canvas styling
- **Added:** Timer display styles
- **Added:** Clear button styles
- **Modified:** Activity box to support larger drawing container

## How It Works

1. **Timer triggers** after 30 seconds of scrolling
2. **Random activity selection** - System picks either quiz or drawing
3. **Drawing activity flow:**
   - Shows prompt (e.g., "draw a flower")
   - Displays 60-second countdown
   - User draws on canvas
   - After 60 seconds, resume button appears
   - User clicks resume to continue scrolling

## Future Enhancements (Team Suggestions)

- Save drawings to Chrome storage
- Share drawings option
- Different brush sizes
- Color picker
- More drawing prompts
- Drawing templates/guides
- Undo/redo functionality

## Troubleshooting

**Canvas not drawing:**
- Check browser console for errors
- Ensure canvas element exists before adding event listeners
- Verify touch events are working (test on mobile)

**Timer not working:**
- Check that `setInterval` is properly cleared
- Verify timer display element exists

**Resume button not appearing:**
- Check timer reaches 0
- Verify button element exists and is set to display:block

