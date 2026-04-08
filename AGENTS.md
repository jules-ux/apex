# Project Rules & Conventions

## Component Protection
- **AdminDashboard.tsx**: This component is considered "finished" in terms of layout and core logic. Do **NOT** modify or refactor this file unless the user explicitly requests changes to the Dashboard.
- **AdminStudents.tsx (Groups)**: The "Groups" view, including the table alignment, transitions, and search interactions, is finalized. Do **NOT** modify this file unless explicitly requested.

## Design Principles
- **Animations**: Always use smooth CSS transitions (`duration-500 ease-in-out`) for panel expansions and mode switches.
- **Layout**: Ensure tables align with top-bar elements (like the search bar).
- **Interactions**: Use `onMouseDown` for search results and interactive dropdowns to ensure reliability on trackpads and prevent premature closing of menus.
- **Visual Style**: Build like a designer, not an AI. Avoid default colors (like standard blue), use refined typography, and maintain high visual polish.

## Data Management
- Future development should focus on centralizing data (e.g., in a shared service or Firebase) to allow different pages (Medical, Logistics) to access the same member records.
