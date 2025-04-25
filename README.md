# Form Prefill UI 📝

An interactive UI tool for mapping form prefill sources using a visual React Flow graph, along with dynamic upstream form data selection.

Video Link - https://youtu.be/pbwYUiALMyI

---

## 📚 Project Structure

/src
  /api
    api.ts          # API calls to fetch the blueprint graph
  /components
    Graph.tsx       # Main react-flow graph component
    PrefillPanel.tsx # Panel shown when clicking on a form node
    PrefillModal.tsx # Modal to select upstream attributes
  /types
    types.ts        # TypeScript types for nodes, forms, prefill sources
  /__tests__
    App.test.tsx
    Graph.test.tsx
    PrefillPanel.test.tsx
    PrefillModal.test.tsx
  App.tsx
  index.tsx
  setupTests.ts     # Global test setup (ResizeObserver polyfill, mocks)



---

## ✨ Available Scripts

In the project directory, you can run:

### `npm install`

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Run the mock server as well.
If the mock server is not running on localhost:3001 please update the mock server port number or update the api.ts file

---

### `npm test`

Launches the test runner in interactive watch mode.  
All tests for the components and API mocks are handled through [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/).

---

## ⚙️ Tech Stack

- **React 18**
- **TypeScript**
- **React Flow** (for graph visualization)
- **Axios** (v0.27.2, downgraded for CommonJS support)
- **Jest** + **React Testing Library** (for testing)

---

## 🏗️ Core Components

| Component          | Responsibility                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `Graph.tsx`        | Render the reactflow graph with nodes and edges, and handle click events to open Prefill Panel |
| `PrefillPanel.tsx` | Opened when you click a node. Lets you map fields to upstream sources                          |
| `PrefillModal.tsx` | Lets you choose fields from upstream nodes or global options                                   |
| `api.ts`           | Fetch the blueprint graph (nodes, edges, forms)                                                |
| `types.ts`         | Define data models (BlueprintNode, BlueprintForm, PrefillSource, etc.)                         |

---

## ✅ Testing Setup

- All main components are unit tested.
- Axios is **mocked** during testing.
- `ResizeObserver` is **polyfilled** inside `setupTests.ts` to support reactflow inside Jest.

| Test File               | What It Covers                                                    |
| ----------------------- | ----------------------------------------------------------------- |
| `App.test.tsx`          | Tests that the main App renders the Graph and data loads          |
| `Graph.test.tsx`        | Ensures nodes from the API are rendered correctly                 |
| `PrefillPanel.test.tsx` | Checks if the Prefill Panel loads form fields and prefill sources |
| `PrefillModal.test.tsx` | Checks upstream form field selection functionality                |

---

##  How To Run Tests

```bash
npm test

---

## ➡️ How to extend with new data sources?

If you want to add new types of prefill sources (for example, an "External API" or "System Variables"), you should:

### 1. Update `types.ts`:

Extend the `PrefillSource` union type:

```ts
export type PrefillSource =
  | { type: "form"; formId: string; field: string }
  | { type: "global"; key: string }
  | { type: "external"; url: string; field: string }; // New type

### 1. Update `PrefillModal.tsx`:

Add an option for the new source type when listing prefill sources:

```ts
const externalOptions = [
  {
    label: "External API → SomeField",
    value: { type: "external", url: "https://api.example.com", field: "someField" }
  }
];

### 2. Update `PrefillPanel.tsx`:

Extend the renderSource method to handle new external source types:

```ts
const renderSource = (source: PrefillSource) => {
  if (source.type === "form") {
    return `${findFormNameByNodeId(source.formId)} → ${source.field}`;
  }
  if (source.type === "global") {
    return source.key;
  }
  if (source.type === "external") {
    return `External → ${source.field} (${source.url})`;
  }
  return "Unknown Source";
};

## What patterns should you pay attention to?

Strong Typing:
Always modify types explicitly through types.ts. No loose types.

Separation of Concerns:
Graph → Prefill Panel → Prefill Modal are clearly separated by responsibility.

Efficient Data Computation:
Use useMemo for expensive calculations like upstream dependency traversal.

Controlled Component Communication:
State changes are localized. Data is passed explicitly through props, not context.

Extendable Testing:
All major UI actions have corresponding tests for easy future extension.
