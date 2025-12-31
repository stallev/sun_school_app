/**
 * Route Path Constants
 * 
 * Single source of truth for all application routes.
 * All route paths must be defined here and imported where needed.
 * 
 * ⚠️ CRITICAL: Never use hardcoded route strings in the codebase.
 * Always import and use RoutePath constants instead.
 * 
 * @example
 * ```ts
 * import { RoutePath } from '@/lib/routes/RoutePath';
 * 
 * // Static route
 * redirect(RoutePath.auth);
 * 
 * // Dynamic route
 * router.push(RoutePath.grades.byId(gradeId));
 * ```
 */

/**
 * Application route paths
 * Organized by category: public, protected, admin
 */
export const RoutePath = {
  // ============================================
  // Public Routes
  // ============================================
  
  /** Authentication page */
  auth: '/auth',
  
  // ============================================
  // Protected Routes (require authentication)
  // ============================================
  
  /** Grades routes */
  grades: {
    /** Base grades list page (Admin view) */
    base: '/grades',
    
    /** My grades page (Teacher redirect) */
    my: '/grades/my',
    
    /** Create new grade page */
    new: '/grades/new',
    
    /** Get grade detail page by ID */
    byId: (id: string) => `/grades/${id}`,
    
    /** Get grade edit page by ID */
    edit: (id: string) => `/grades/${id}/edit`,
    
    /** Get grade settings page by ID */
    settings: (id: string) => `/grades/${id}/settings`,
    
    /** Get grade schedule page by ID */
    schedule: (id: string) => `/grades/${id}/schedule`,
    
    /** Lessons routes for a grade */
    lessons: {
      /** Create new lesson for a grade */
      new: (gradeId: string) => `/grades/${gradeId}/lessons/new`,
    },
  },
  
  /** Lessons list page */
  lessons: '/lessons',
  
  /** Homework check page */
  homeworkCheck: '/homework-check',
  
  /** Pupil personal data page */
  pupilPersonalData: '/pupil-personal-data',
  
  /** Grade leaderboard page */
  gradeLeaderboard: '/grade-leaderboard',
  
  /** Golden verses library page */
  goldenVersesLibrary: '/golden-verses-library',
  
  /** Schedule page */
  schedule: '/schedule',
  
  // ============================================
  // Admin Routes (require ADMIN or SUPERADMIN role)
  // ============================================
  
  /** Teachers management page */
  teachersManagement: '/teachers-management',
  
  /** Pupils management page */
  pupilsManagement: '/pupils-management',
  
  /** Families management page */
  familiesManagement: '/families-management',
  
  /** School process management page */
  schoolProcessManagement: '/school-process-management',
} as const;

/**
 * Helper function to get all public routes
 * Used in middleware for route protection
 */
export const getPublicRoutes = (): string[] => {
  return [RoutePath.auth, '/api'];
};

/**
 * Helper function to get all protected routes
 * Used in middleware for route protection
 */
export const getProtectedRoutes = (): string[] => {
  return [
    RoutePath.grades.base,
    RoutePath.lessons,
    RoutePath.homeworkCheck,
    RoutePath.pupilPersonalData,
    RoutePath.gradeLeaderboard,
    RoutePath.goldenVersesLibrary,
  ];
};

/**
 * Helper function to get all admin routes
 * Used in middleware for route protection
 */
export const getAdminRoutes = (): string[] => {
  return [
    RoutePath.teachersManagement,
    RoutePath.pupilsManagement,
    RoutePath.familiesManagement,
    RoutePath.schoolProcessManagement,
  ];
};

