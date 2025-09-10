# 🃏 Joker Web App by Ander.

A modern Vue 3 + TypeScript application for browsing, creating, and managing jokes with reactive pagination, filtering, and rating capabilities.

## ✨ Features

- 📱 **Responsive Design**: Mobile-first approach with flexible layouts
- 🎯 **Real-time Filtering**: Filter jokes by type, sort by various criteria
- ⭐ **Rating System**: Rate jokes with interactive star components
- 📄 **Smart Pagination**: Reactive pagination with configurable items per page
- 💾 **Local Storage**: Caches API data and persists user-created jokes
- 🎨 **Modern UI**: Clean design with hover effects and transitions
- 🧪 **Comprehensive Testing**: Unit tests (Vitest) and E2E tests (Playwright)
- 🔍 **TypeScript**: Full type safety across the application
- 🎭 **User Jokes**: Create, edit, and delete your own jokes
- 🔄 **State Management**: Pinia store with reactive computeds

## 🛠️ Tech Stack

- **Frontend**: Vue 3 (Composition API) + TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: CSS3 with BEM methodology
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Linting**: ESLint + TypeScript ESLint
- **API**: Official Joke API integration (https://github.com/15Dkatz/official_joke_api/)

## 🏗️ Architecture

```
src/
├── components/           # Vue components (Atomic Design)
│   ├── atoms/           # Basic UI elements (Button, Card, etc.)
│   ├── molecules/       # Composed components (JokeCard, etc.)
│   └── organisms/       # Complex components (ToolBar, JokeList)
├── composables/         # Reusable composition functions
│   └── usePagination.ts # Pagination logic
├── interfaces/          # TypeScript interfaces
├── services/           # API service layer
├── stores/             # Pinia stores
├── types/              # Type definitions
├── utils/              # Helper functions
├── const/              # Constants and configurations
└── page/               # Page-level components
```

## 🏛️ Architecture & Design Decisions

### 🎯 Architectural Patterns Applied

#### 1. **Atomic Design Pattern**
I follow Brad Frost's Atomic Design methodology for component organization:

- **Atoms**: Smallest building blocks (AppButton, AppCard, AppHeader)
- **Molecules**: Simple combinations of atoms (JokeCard, AppTextField, AppDropdown)
- **Organisms**: Complex combinations forming distinct sections (AppJokeList, AppToolBar, AppFormJoke)
- **Pages**: Complete page layouts combining organisms

**Rationale**: Promotes reusability, consistency, and scalable component architecture.

#### 2. **Composition API + Composables Pattern**
Vue 3's Composition API with custom composables for shared logic:

```typescript
// usePagination.ts - Reusable pagination logic
export function usePagination<T>(source: () => T[]) {
  // Reactive pagination state and computed values
  const paginatedItems = computed(() => /* ... */)
  return { paginatedItems, totalPages, setPage, setPerPage }
}
```

**Benefits**:
- Better code organization and reusability
- Type-safe reactive state management
- Easier testing and composition

#### 3. **Store Pattern with Pinia**
Centralized state management following the store pattern:

```typescript
export const useJokesStore = defineStore("jokes", () => {
  // Reactive state
  const jokes = ref<Joke[]>([])
  const sortBy = ref<SortBy>("setup-asc")
  
  // Computed derived state
  const sortedAndFilteredJokes = computed(() => /* ... */)
  
  // Actions
  function addJoke(joke: Joke) { /* ... */ }
  
  return { jokes, sortedAndFilteredJokes, addJoke }
})
```

**Advantages**:
- Single source of truth for application state
- Reactive computed values for derived state
- Clear separation between state and business logic

#### 4. **Service Layer Pattern**
Abstraction layer for external API communication:

```typescript
// jokeService.ts
export const getJokesAll = async (): Promise<Joke[]> => {
  const response = await fetch(`${BASE_URL}/ten`)
  return response.json()
}
```

**Purpose**:
- Decouples components from API implementation details
- Centralized error handling and response transformation
- Easy to mock for testing

#### 5. **BEM (Block Element Modifier) CSS Methodology**
Structured CSS naming convention:

**Benefits**:
- Predictable CSS structure
- No naming conflicts
- Component-scoped styling

### 🎭 Design Patterns Implemented

#### 1. **Observer Pattern**
Vue's reactivity system implements the observer pattern:
- Reactive data automatically updates dependent components
- Computed properties react to dependency changes
- Watch functions observe specific reactive references

#### 2. **Factory Pattern**
Service layer acts as a factory for API requests:
```typescript
const createJokeRequest = (endpoint: string) => 
  fetch(`${BASE_URL}${endpoint}`).then(response => response.json())
```

#### 3. **Strategy Pattern**
Different sorting strategies for jokes:
```typescript
const comparators: Record<SortBy, (a: Joke, b: Joke) => number> = {
  'setup-asc': (a, b) => a.setup.localeCompare(b.setup),
  'rating-desc': (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  // ... other strategies
}
```

#### 4. **Command Pattern**
Form actions as command objects:
```typescript
const formActions = {
  create: () => addJoke(formData),
  edit: () => updateJoke(jokeId, formData),
  cancel: () => setModeForm('none')
}
```

### 🔄 Data Flow Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Components    │◄──►│    Store     │◄──►│   Services      │
│   (Reactive)    │    │   (Pinia)    │    │ (API Layer)     │
└─────────────────┘    └──────────────┘    └─────────────────┘
         ▲                       ▲                    ▲
         │                       │                    │
         ▼                       ▼                    ▼
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│  Composables    │    │  Computed    │    │ Local Storage   │
│ (Shared Logic)  │    │  (Derived)   │    │   (Cache)       │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

### 🧩 Key Architectural Decisions

#### 1. **Why Vue 3 Composition API?**
- Better TypeScript integration
- More flexible code organization
- Easier logic reuse across components
- Better tree-shaking and bundle optimization

#### 2. **Why Pinia over Vuex?**
- Simpler, more intuitive API
- Better TypeScript support
- No mutations needed (direct state modification)
- Automatic code splitting

#### 3. **Why Atomic Design?**
- Promotes component reusability
- Easier to maintain design system consistency
- Clear component hierarchy and dependencies
- Facilitates parallel development

#### 4. **Why Separate Service Layer?**
- Easier testing with mocked services
- Consistent error handling across the app
- API changes don't directly affect components
- Supports offline-first strategies with cache layer

#### 5. **Why BEM CSS Methodology?**
- Prevents CSS conflicts in large applications
- Self-documenting component structure
- Easier to maintain and refactor styles
- Works well with component-scoped CSS

### 📊 Performance Considerations

- **Lazy Loading**: Async components for code splitting
- **Reactive Computeds**: Efficient derived state calculations
- **Local Storage Caching**: Reduces API calls and improves loading times
- **Pagination**: Limits DOM nodes for better rendering performance
- **Debounced Operations**: Prevents excessive API calls during filtering

### 🧪 Testing Strategy

- **Unit Tests**: Component isolation with Vitest
- **E2E Tests**: User workflow validation with Playwright
- **Mocking Strategy**: Service layer mocks for predictable testing
- **Coverage Goals**: >80% code coverage for critical paths

This architecture ensures maintainability, scalability, and developer experience while following Vue.js ecosystem best practices.

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anderssonq/joker-web-app.git
cd joker-web-app

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```bash
VITE_JOKE_API_BASE_URL=https://official-joke-api.appspot.com
VITE_JOKE_CACHE_MINUTES=5
```

### Development Server

```bash
# Start development server (http://localhost:5173)
npm run dev
```

### Build for Production

```bash
# Type-check and build
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit:watch

# Generate coverage report
npm run test:unit:coverage
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test:unit` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run lint` | Lint and fix code |
| `npm run type-check` | Type checking only |

## 🎮 Usage Guide

### Browsing Jokes

1. **View Jokes**: The main page displays a paginated list of jokes
2. **Filter by Type**: Use the dropdown to filter jokes by category (programming, general, etc.)
3. **Sort Options**: Sort by setup (A-Z), rating, type, or view only your jokes
4. **Pagination**: Navigate through pages using the pagination controls

### Creating Jokes

1. Click the **"Add a new Joke 😜"** button
2. Fill in the setup and punchline fields
3. Select a joke type from the dropdown
4. Click **"Save Joke"** to add it to your collection

### Managing Jokes

- **Rate Jokes**: Click on stars to rate any joke (1-5 stars)
- **Edit Your Jokes**: Click the edit button on jokes you created
- **Delete Jokes**: Click the remove button and confirm deletion

### Responsive Design

The app adapts to different screen sizes:
- **Desktop**: Full toolbar with side-by-side layout
- **Tablet**: Stacked toolbar elements
- **Mobile**: Single-column layout with touch-friendly controls

## 🔧 Configuration

### Cache Settings

Modify cache duration in `.env`:
```bash
VITE_JOKE_CACHE_MINUTES=10  # Cache API data for 10 minutes
```

### Pagination

Default pagination settings in `usePagination.ts`:
```typescript
const perPage = ref(5)  # Items per page
```

### API Endpoints

The app uses the Official Joke API:
- `GET /types` - Fetch available joke types
- `GET /ten` - Fetch 10 random jokes

## 🏗️ Component Design

### Atomic Design Structure

**Atoms** (Basic building blocks):
- `AppButton.vue` - Reusable button component
- `AppCard.vue` - Card container with BEM classes
- `AppHeader.vue` - Application header
- `AppRating.vue` - Star rating component

**Molecules** (Simple combinations):
- `JokeCard.vue` - Individual joke display
- `AppTextField.vue` - Form input component
- `AppDropdown.vue` - Select dropdown

**Organisms** (Complex components):
- `AppJokeList.vue` - Joke listing with pagination
- `AppToolBar.vue` - Filtering and controls
- `AppFormJoke.vue` - Joke creation/editing form

### State Management

The app uses Pinia for state management with these stores:

- **JokesStore**: Manages jokes data, filtering, sorting, and pagination
- Reactive computeds for filtered/sorted data
- Local storage integration for persistence

## 🐛 Troubleshooting

### Common Issues

**Build Errors**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Type Errors**:
```bash
# Run type checking
npm run type-check
```

**E2E Test Failures**:
```bash
# Update Playwright browsers
npx playwright install
```

**API Connection Issues**:
- Check `.env` file configuration
- Verify internet connection
- Check browser console for CORS errors


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**A joke app made serious with ❤️ and Vue.js — by [Ander](https://andersoftware.com/)**
