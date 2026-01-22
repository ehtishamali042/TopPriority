# LLM Implementation Brief: Tasbeeh Counter Module for "TopPriority"

## 1. Your Role and Goal

You are an expert React Native + Expo + TypeScript engineer working inside an existing app called **TopPriority**. The goal of this task is to design and implement a **Tasbeeh Counter module** that helps a Muslim user recite specific adhkar/tasbeeh in a structured, focused way.

Your primary focus should be:

- Clean, extensible **architecture** (module-based, well-structured code).
- Simple, **standard UI** consistent with a modern React Native / Expo app.
- Using the existing tooling and components in this repo where appropriate.

For now, **do not implement reminders/notifications**. Focus only on the Tasbeeh counter CRUD and navigation.

---

## 2. Project Context

Assume the project is an Expo + TypeScript app with the following structure (simplified):

- `app/`
  - `_layout.tsx`
  - `modal.tsx`
  - `(tabs)/`
    - `_layout.tsx`
    - `index.tsx`
    - `explore.tsx`
- `components/`
  - `themed-text.tsx`
  - `themed-view.tsx`
  - `ui/` (basic UI building blocks)
- `constants/theme.ts`
- `hooks/` (color scheme, theme helpers)

This is a typical **Expo Router** (`app` directory) layout. Use Expo Router conventions for navigation.

The app name and concept: **TopPriority** — helping a Muslim user recognize Allah, overcome obstacles, and prioritize what matters most. The Tasbeeh module is one sub-module of this larger vision.

---

### 2.1 Core Libraries to Use and Install

For styling and state/data management, use these libraries (keep things as simple as possible):

1. **NativeWind (Tailwind for React Native)** for styling.
2. **Recoil** for client-side state management of Tasbeeh data.
3. **@tanstack/react-query** installed and ready for **future** server/remote data (the Tasbeeh module itself can stay fully local for now).

Install them (using npm; adapt to yarn/pnpm if the project uses those):

```bash
npm install nativewind tailwindcss
npm install recoil
npm install @tanstack/react-query
```

Then, set them up as follows:

- **NativeWind**
  - Create and configure `tailwind.config.js` (include `./app/**/*.{ts,tsx}` and `./views/**/*.{ts,tsx}` in `content`).
  - Add the NativeWind Babel plugin in `babel.config.js` according to the NativeWind docs.
  - Use `className` on React Native components and wrap typography/layout in existing themed components where appropriate.

- **Recoil**
  - Wrap the top-level app layout (e.g., in `app/_layout.tsx` or the highest shared layout) with `RecoilRoot`.
  - Model Tasbeeh state as Recoil atoms/selectors instead of plain React Context.

- **React Query (@tanstack/react-query)**
  - Install now so it is available when you later add remote APIs.
  - Optionally create a `QueryClient` and wrap the app in `QueryClientProvider` near the root; the Tasbeeh feature does **not** need to use React Query yet.

Avoid introducing `styled-components` or other CSS-in-JS libraries in this project; prefer NativeWind + a small set of reusable, themed UI primitives.

---

## 3. High-Level Feature Description

Implement a **Tasbeeh Counter module** with these features:

1. **Tasbeeh List / Overview screen**
   - Shows a list of tasbeeh counters the user has defined.
   - Each item displays at least:
     - Title (e.g., "SubhanAllah")
     - Phrase (e.g., "سُبْحَانَ ٱللَّٰهِ")
     - Target count (e.g., 33)
     - Periodicity: `daily`, `weekly`, or `monthly`.
   - Tapping an item navigates to the **Counter screen** for that tasbeeh.

2. **Tasbeeh CRUD (Create / Update / Delete)**
   - Ability to **create** a new tasbeeh entry with fields:
     - `name` or `label`
     - `arabicText` (optional but recommended)
     - `translation` (optional description)
     - `targetCount` (integer)
     - `period` (enum: `daily` | `weekly` | `monthly`)
   - Ability to **edit** an existing tasbeeh (same fields).
   - Ability to **delete** a tasbeeh.
   - For now, **no reminders/notifications** — just data and UI.
   - It’s acceptable to use simple local persistence (e.g., AsyncStorage) or keep everything in-memory if that matches project patterns. Prefer persistence if straightforward.

3. **Tasbeeh Counter screen**
   - For a selected tasbeeh, show:
     - The tasbeeh name.
     - The Arabic phrase (if available).
     - Current count and target (e.g., `12 / 33`).
   - A **single main interaction**: tapping a large, clear area/button **increments** the count by 1.
   - No decrement for now — **only increment**.
   - Standard navigation back (using header back button or explicit button) returns to the list.

4. **Architecture and UX emphasis**
   - Prioritize a **clean module architecture** so the Tasbeeh feature feels like a self-contained, extendable unit.
   - Use simple, consistent, and modern UI components. Prefer existing `ThemedView` / `ThemedText` and shared UI elements where applicable.

---

## 4. Architecture & Folder Structure Requirements

Design the Tasbeeh module to be **modular**, well-isolated, and to keep the `app/` folder clean so it only contains **route definitions**, not screen logic.

### 4.1. Folder Structure (Proposal)

Follow this pattern:

- `app/` → **routes only**, very thin files that simply render screen components from `views/`.
- `views/` → contains the actual **screen components and logic**, mirroring the route hierarchy.
- `features/` (or `modules/`) → contains shared, non-UI feature logic (types, storage, context, hooks, etc.).

For the Tasbeeh module specifically:

- `app/(tasbeeh)/`
  - `_layout.tsx` → Stack layout for the Tasbeeh module, imports screens from `views/tasbeeh`.
  - `index.tsx` → Route file that simply renders the Tasbeeh list screen component.
  - `edit.tsx` → Route file that simply renders the create/edit screen component.
  - `[id].tsx` → Route file that simply renders the counter screen component.
- `views/tasbeeh/`
  - `TasbeehListScreen.tsx` → List / overview UI and logic.
  - `TasbeehEditScreen.tsx` → Create/edit form UI and logic.
  - `TasbeehCounterScreen.tsx` → Counter UI and logic.
- `features/tasbeeh/` (or `modules/tasbeeh/` if that fits project style)
  - `types.ts` → TypeScript interfaces / enums.
  - `storage.ts` → AsyncStorage or persistence helpers.
  - `state.ts` or `atoms.ts` → Recoil atoms/selectors for Tasbeeh data.
  - `hooks.ts` → Custom hooks like `useTasbeehs`, `useTasbeeh(id)` that work with Recoil.

All future modules should follow the same principle: `app/` declares routes; `views/` holds the corresponding screen components and logic, with a mirrored folder hierarchy.

### 4.2. Data Model

Define a clear TypeScript model, e.g.:

```ts
export type TasbeehPeriod = "daily" | "weekly" | "monthly";

export interface Tasbeeh {
  id: string; // e.g., UUID or stable string
  name: string;
  arabicText?: string;
  translation?: string;
  targetCount: number;
  period: TasbeehPeriod;
  currentCount: number;
}
```

You may also include fields like `createdAt`, `updatedAt`, or tracking info as needed, but keep the core simple.

### 4.3. State Management

- Use **Recoil** for Tasbeeh state instead of plain React Context.
- Define one or more Recoil atoms/selectors, e.g. a `tasbeehListState` atom holding an array of `Tasbeeh`.
- Expose operations via helper functions/hooks such as:
  - `addTasbeeh(input)`
  - `updateTasbeeh(id, updates)`
  - `deleteTasbeeh(id)`
  - `incrementTasbeehCount(id)`
- Optionally connect Recoil to persistence using `AsyncStorage` (e.g., via an effect or manual load/save helpers in `storage.ts`). Design this so that future extensions (like reset per day/week/month or remote sync with React Query) are easy.

---

## 5. Navigation Requirements

Work with **Expo Router** and the existing tab layout.

1. **Module stack layout**
   - In `app/(tasbeeh)/_layout.tsx`, set up a `Stack` from `expo-router`.
   - Include screens for:
     - `index` (Tasbeeh list)
     - `edit` (Create/Edit form)
     - `[id]` (Counter view)

2. **Entry point from tabs**
   - Integrate the Tasbeeh module into the existing tab navigation (likely declared in `app/(tabs)/_layout.tsx`).
   - Add a new tab (e.g., label: `Tasbeeh`) that navigates to the appropriate route in `(tasbeeh)`.
   - Use an icon style consistent with existing tabs (e.g., via `icon-symbol` components under `components/ui`).

3. **Back navigation**
   - Ensure the Stack header back button (or equivalent) allows the user to go back from the Counter screen to the list.
   - Do not implement any complex nested custom back behavior. Rely on standard Stack navigation.

---

## 6. UI & UX Guidelines

1. **Theming and Components**
   - Use existing theme hooks and components:
     - `ThemedView`, `ThemedText` for layout and text.
     - Shared UI atoms from `components/ui` where useful.
   - Respect dark/light mode if the project already supports it via `use-color-scheme` or similar hooks.

2. **Tasbeeh List Screen**
   - Layout:
     - A header/title such as "Tasbeeh Counters".
     - A list of cards or rows for each tasbeeh.
     - A primary button/FAB to create a new tasbeeh.
   - Each item should show:
     - Name.
     - Target count and period (e.g., `33 · daily`).
     - Optionally current progress (e.g., `12 / 33`).
   - Tapping an item → navigates to Counter screen.
   - Provide a way to access edit/delete (e.g., long press, trailing icon, or a separate edit screen).

3. **Create/Edit Screen**
   - Use standard, simple form layout:
     - Inputs for name, Arabic text, translation, target count.
     - Dropdown/segmented control or simple picker for period (daily/weekly/monthly).
   - PrimaryCTA: Save.
   - Secondary action: Cancel/back.
   - On Save:
     - If creating: add new tasbeeh and go back to list.
     - If editing: update existing tasbeeh and go back.

4. **Counter Screen**
   - Minimal, focused layout that encourages dhikr without distractions.
   - Show:
     - Tasbeeh name.
     - Arabic text prominently.
     - Translation (smaller text).
     - Current progress: `currentCount / targetCount`.
   - Main interaction:
     - A large central button or tappable area that increments by `+1` each tap.
     - Use subtle haptic feedback if the project already depends on such utilities (optional, not required).
   - Back navigation: standard stack header back.

5. **No reminders yet**
   - Explicitly avoid implementing notifications, alarms, or scheduling for now.
   - However, structure the code so that adding such features later will be straightforward (e.g., clear data model, periods defined).

---

## 7. Implementation Steps (What You Should Do)

Follow these steps in a logical order. Adjust minor details if the existing codebase dictates it, but keep the spirit of the architecture.

1. **Install and configure libraries**
   - Install and configure **NativeWind** and **Recoil** as described in section 2.1.
   - Install **@tanstack/react-query** (no need to use it in this Tasbeeh feature yet).
   - Ensure `RecoilRoot` wraps the app at an appropriate root layout.

2. **Set up types and storage**
   - Create `features/tasbeeh/types.ts` with the `Tasbeeh` model and `TasbeehPeriod` type.
   - Create `features/tasbeeh/storage.ts` with basic load/save helpers (e.g., `loadTasbeehs`, `saveTasbeehs`) using `AsyncStorage` or the project’s preferred storage.

3. **Create Tasbeeh Recoil state and hooks**
   - Define Recoil atoms/selectors for Tasbeeh data (e.g., `tasbeehListState`).
   - Implement simple helper hooks in `features/tasbeeh/hooks.ts` such as `useTasbeehs`, `useTasbeeh(id)`, and minimal action wrappers (`useAddTasbeeh`, etc.) that update Recoil state and call `storage.ts` for persistence.
   - Keep the logic straightforward; avoid over-abstracting.

4. **Create the Tasbeeh route group**
   - Add `app/(tasbeeh)/_layout.tsx` with an Expo Router `Stack`.
   - Add `app/(tasbeeh)/index.tsx` for the list, `edit.tsx` for the form, and `[id].tsx` for the counter.
   - Use the context/hooks to read/write Tasbeeh data in these screens.

5. **Integrate into tab navigation**
   - Update `app/(tabs)/_layout.tsx` to add a new tab pointing to the Tasbeeh route.
   - Use a consistent icon and label.

6. **Implement UI per screen**
   - Tasbeeh List: list UI + create entry button.
   - Edit: form fields + validation (basic: required name and targetCount > 0).
   - Counter: centered large increment button and clear progress display.

7. **Polish and alignment**
   - Ensure TypeScript types are correct and no obvious type errors remain.
   - Follow existing ESLint/Prettier/project style.
   - Keep components small and focused; factor out shared bits as needed, but avoid over-engineering.

---

## 8. Constraints and Non-Goals

- **Do NOT** implement reminders, notifications, or scheduling right now.
- **Do NOT** introduce large additional dependencies beyond **NativeWind**, **Recoil**, and **@tanstack/react-query** unless absolutely necessary.
- **Do NOT** break existing navigation or project structure.
- Respect the current code style and patterns as much as possible.

---

## 9. Acceptance Criteria

The implementation is considered successful if:

1. There is a **Tasbeeh tab** in the main tab bar that opens into the Tasbeeh module.
2. The user can:
   - Create a tasbeeh with name, target count, and period.
   - See all tasbeehs in a list.
   - Tap one tasbeeh to open a counter screen.
   - Increment the count by tapping a primary button/area.
   - Navigate back to the list.
   - Edit or delete existing tasbeehs via some simple UI.
3. The code is:
   - Modular (separate feature folder/module for Tasbeeh).
   - Type-safe (TypeScript types defined and used consistently).
   - Styled using the project’s theming and standard UI components.

Implement all of the above as cleanly and simply as possible, with emphasis on architecture and a calm, focused user experience for dhikr and tasbeeh counting.
