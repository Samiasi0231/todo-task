# 📋 Todo Board — 3D Project Management App

A pixel-perfect implementation of the Figma design with React Three Fiber 3D integration.

## Stack
- **Next.js 14** (App Router, Server + Client Components)
- **Tailwind CSS** — all layout and styling
- **MUI** — Modal/form elements in AddTask dialog
- **Redux Toolkit** — global state (tasks + UI)
- **React Three Fiber + Three.js** — animated 3D background scene
- **Font** — Exo 2 (Google Fonts)

## Features
- ✅ Kanban board with To Do / In Progress / Done columns
- ✅ Drag & drop tasks between columns (HTML5 native DnD)
- ✅ Add / Edit / Delete tasks via modal
- ✅ Progress bars with status-aware colors (orange → red → green)
- ✅ Assignee avatar stacks
- ✅ Light / Dark mode toggle (persisted to localStorage)
- ✅ Tasks persisted to localStorage
- 🎮 **3D Background**: 22 wireframe geometric shapes (boxes, spheres, tori, octahedra) float and rotate. Their color shifts from 🟠 orange → 🟣 indigo → 🟢 green as overall task completion % increases.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  layout.tsx          # Root layout (providers, font)
  page.tsx            # Server Component entry
  globals.css         # Tailwind + Exo 2 import + custom classes

components/
  providers/
    ReduxProvider.tsx # Redux store wrapper
    ThemeSync.tsx     # Syncs Redux theme → <html class>
  layout/
    MainLayout.tsx    # Top-level layout orchestrator
    IconStrip.tsx     # Left narrow icon navigation strip
    Sidebar.tsx       # Dark sidebar with Projects/Tasks nav
    Header.tsx        # Greeting, date, board view tabs
  board/
    BoardView.tsx     # 3-column kanban wrapper
    TaskColumn.tsx    # Single column with DnD drop zone
    TaskCard.tsx      # Individual task card
    AddTaskModal.tsx  # Add/edit task modal form
  three/
    Scene3D.tsx       # React Three Fiber 3D background
  ui/
    ProgressBar.tsx   # Animated colored progress bar
    AvatarStack.tsx   # Overlapping assignee avatars

store/
  index.ts            # Redux store config
  tasksSlice.ts       # Tasks CRUD + localStorage persistence
  uiSlice.ts          # Theme, modals, navigation state

types/index.ts        # TypeScript interfaces
lib/initialData.ts    # Seed data matching Figma
hooks/useTypedRedux.ts # Typed useDispatch / useSelector
```
