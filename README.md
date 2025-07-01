# Model Status Table Main

This is a Next.js 13+ (App Router) project for managing, displaying, and updating the approval status of AI models. It provides a dashboard for users to view all models, filter/search, and for admins to update the status of each model across legal, cyber, and procurement review tracks.

## Features

- **Dashboard**: View all AI models and their approval status.
- **Filtering & Search**: Filter models by category and search by name or category.
- **Add New Model**: Submit a new model for approval via a form.
- **Admin Controls**: Admins can update the status and comments for each model.
- **API Integration**: All data is fetched and updated via RESTful API routes connected to a PostgreSQL database.

---

## Folder Structure

```
model-status-table-main/
  app/
    api/
      models/         # API route for model CRUD
      logs/           # API route for logging updates
      auth/           # Authentication API
    page.tsx          # Main dashboard page
    layout.tsx        # App layout
    login/            # Login page
    providers.tsx     # Context providers
    globals.css       # Global styles
  components/
    model-table.tsx   # Main table component
    filter-section.tsx# Filtering UI
    NewModelForm.tsx  # Form to add new model
    status-badge.tsx  # Status badge component
    Header.tsx        # Page header
    Footer.tsx        # Page footer
    ...               # UI primitives
  lib/
    auth-middleware.ts# Auth helpers
    utils.ts          # Utility functions
  hooks/
    use-toast.ts      # Toast notification hook
    use-mobile.tsx    # Mobile detection hook
  styles/             # Tailwind and custom CSS
  ...
```

---

## Main Components & Functions

### 1. `app/page.tsx` (ModelStatusDashboard)
- **Purpose**: Main dashboard page. Fetches model data, manages search/filter state, and renders the table and form.
- **Key Logic**:
  - Fetches model data from `/api/models`.
  - Filters data by search term and category.
  - Renders `FilterSection`, `NewModelForm`, and `ModelTable`.

### 2. `components/model-table.tsx` (ModelTable)
- **Purpose**: Displays the list of models in a table. Allows admins to update status and comments.
- **Key Props**:
  - `filteredData`: Array of models to display.
  - `totalCount`: Total number of models.
  - `onUpdate`: Callback to refresh data after an update.
- **Key Logic**:
  - Renders each model row with status badges.
  - If user is admin, allows editing status and comments.
  - Calls `/api/models` (PUT) to update status and `/api/logs` (POST) to log changes.

### 3. `components/NewModelForm.tsx` (NewModelForm)
- **Purpose**: Modal form to submit a new model for approval.
- **Key Logic**:
  - Uses `react-hook-form` and `zod` for validation.
  - On submit, POSTs to `/api/models`.
  - Calls `onModelAdded` callback to refresh data.

### 4. `components/filter-section.tsx` (FilterSection)
- **Purpose**: UI for searching and filtering models.
- **Key Props**:
  - `searchTerm`, `setSearchTerm`: For search input.
  - `categoryFilter`, `setCategoryFilter`: For category dropdown.
  - `categories`: List of available categories.
  - `rightAction`: Optional action button (e.g., new model form).

### 5. `components/status-badge.tsx` (StatusBadge)
- **Purpose**: Renders a colored badge for each status (e.g., green, yellow, red, submitted, etc.).
- **Key Logic**:
  - Maps status string to a color/style.

### 6. `app/api/models/route.ts` (API Route)
- **GET**: Returns all models from the database.
- **POST**: Adds a new model request.
- **PUT**: Updates the status/comments for a model (admin only).

---

## How It Works

1. **User visits dashboard**: All models are fetched and displayed.
2. **Filtering/search**: User can filter by category or search by name/category.
3. **Add new model**: User fills out the form; data is validated and sent to the backend.
4. **Admin actions**: Admins can update the status and comments for each model.
5. **API**: All data operations are handled via RESTful API routes using PostgreSQL.

---

## Setup & Development

1. Install dependencies:
   ```sh
   cd model-status-table-main
   pnpm install
   # or
   npm install
   ```
2. Set up your `.env` with the required database and auth variables.
3. Run the development server:
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string.
- Auth-related variables for NextAuth/MSAL as needed.

---

## API Endpoints

- `GET /api/models` — List all models.
- `POST /api/models` — Add a new model.
- `PUT /api/models` — Update model status/comments (admin only).

---

## Contributing

- Fork the repo, create a feature branch, and submit a PR.
- Please document any new components or API endpoints.

