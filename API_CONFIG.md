# API Configuration Guide

## Environment Variables Setup

### Frontend (.env)

The frontend uses React environment variables that must be prefixed with `REACT_APP_`.

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Backend (.env)

The backend uses standard environment variables:

```env
# Database Configuration
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/yala-safari

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
```

## API Configuration Usage

### Centralized Configuration

All API endpoints are now managed through `src/config/api.js`:

```javascript
import { apiEndpoints } from "../config/api";

// Instead of hardcoded URLs
fetch("http://localhost:5000/api/packages/current");

// Use centralized configuration
fetch(apiEndpoints.packages.current);
```

### Available Endpoints

- `apiEndpoints.packages.current` - Get current pricing
- `apiEndpoints.packages.admin` - Admin package management
- `apiEndpoints.blogs.base` - Blog operations
- `apiEndpoints.contact` - Contact form
- `apiEndpoints.booking` - Booking operations
- `apiEndpoints.dashboard.overview` - Dashboard stats
- `apiEndpoints.images.base` - Image management

### Environment-based Configuration

To change the base URL for different environments:

**Development:**

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

**Production:**

```env
REACT_APP_API_BASE_URL=https://api.yalasafari.com
```

**Staging:**

```env
REACT_APP_API_BASE_URL=https://staging-api.yalasafari.com
```

### Benefits

1. **Single source of truth** for all API endpoints
2. **Easy environment switching** without code changes
3. **Consistent URL management** across the application
4. **Better maintainability** and debugging
5. **Reduced hardcoded URLs** throughout the codebase


