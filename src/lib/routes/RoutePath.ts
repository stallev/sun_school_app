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
  
  /** 404 Not Found page */
  notFound: '/not-found',
  
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
    
    /** Get academic years management page by ID */
    academicYears: (id: string) => `/grades/${id}/academic-years`,
    
    /** Get lessons list page for academic year */
    academicYearLessons: (gradeId: string, yearId: string) => 
      `/grades/${gradeId}/academic-years/${yearId}/lessons`,
    
    /** Get grade rating page by ID */
    rating: (id: string) => `/grades/${id}/rating`,
    
    /** Get grade issue bricks page by ID */
    issueBricks: (id: string) => `/grades/${id}/issue-bricks`,
    
    /** Schedule routes for a grade */
    schedule: {
      /** Get grade schedule page by ID */
      base: (id: string) => `/grades/${id}/schedule`,
      
      /** Create new schedule event for a grade */
      new: (id: string) => `/grades/${id}/schedule/new`,
      
      /** Get schedule event edit page by grade ID and event ID */
      edit: (gradeId: string, eventId: string) => 
        `/grades/${gradeId}/schedule/${eventId}/edit`,
    },
    
    /** Lessons routes for a grade */
    lessons: {
      /** Create new lesson for a grade */
      new: (gradeId: string) => `/grades/${gradeId}/lessons/new`,
    },
  },
  
  /** Lessons routes */
  lessons: {
    /** Base lessons list page */
    base: '/lessons',
    
    /** Create new lesson page */
    new: '/lessons/new',
    
    /** Get lesson detail page by ID */
    byId: (id: string) => `/lessons/${id}`,
    
    /** Get lesson edit page by ID */
    edit: (id: string) => `/lessons/${id}/edit`,
    
    /** Get lesson complete table page by ID */
    completeTable: (id: string) => `/lessons/${id}/complete-table`,
    
    /** Get lesson homework checking page by ID */
    checkingHomework: (id: string) => `/lessons/${id}/checking-homework`,
  },
  
  /** Homework check page */
  homeworkCheck: '/homework-check',
  
  /** Pupil personal data routes */
  pupilPersonalData: {
    /** Base pupil personal data page */
    base: '/pupil-personal-data',
    
    /** Get pupil personal data page by ID */
    byId: (id: string) => `/pupil-personal-data/${id}`,
    
    /** Get pupil achievements page by ID */
    achievements: (id: string) => `/pupil-achievements/${id}`,
  },
  
  /** Grade leaderboard page */
  gradeLeaderboard: '/grade-leaderboard',
  
  /** Golden verses library routes */
  goldenVersesLibrary: {
    /** Base golden verses library page */
    base: '/golden-verses-library',
    
    /** Create new golden verse page */
    new: '/golden-verses-library/new',
    
    /** Get golden verse edit page by ID */
    edit: (id: string) => `/golden-verses-library/${id}/edit`,
    
    /** Golden verses statistics page */
    statistics: '/golden-verses-library/statistics',
  },
  
  /** Schedule page */
  schedule: '/schedule',
  
  // ============================================
  // Admin Routes (require ADMIN or SUPERADMIN role)
  // ============================================
  
  /** Teachers management routes */
  teachersManagement: {
    /** Base teachers management page */
    base: '/teachers-management',
    
    /** Create new teacher page */
    new: '/teachers-management/new',
    
    /** Get teacher edit page by ID */
    edit: (id: string) => `/teachers-management/${id}/edit`,
  },
  
  /** Pupils management routes */
  pupilsManagement: {
    /** Base pupils management page */
    base: '/pupils-management',
    
    /** Create new pupil page */
    new: '/pupils-management/new',
    
    /** Get pupil edit page by ID */
    edit: (id: string) => `/pupils-management/${id}/edit`,
  },
  
  /** Families management routes */
  familiesManagement: {
    /** Base families management page */
    base: '/families-management',
    
    /** Create new family page */
    new: '/families-management/new',
    
    /** Get family edit page by ID */
    edit: (id: string) => `/families-management/${id}/edit`,
  },
  
  /** School process management routes */
  schoolProcessManagement: {
    /** Base school process management page */
    base: '/school-process-management',
    
    /** Academic years routes */
    academicYears: {
      /** Create new academic year page */
      new: '/school-process-management/academic-years/new',
    },
  },
} as const;

/**
 * Helper function to get all public routes
 * Used in middleware for route protection
 */
export const getPublicRoutes = (): string[] => {
  return [RoutePath.auth, RoutePath.notFound, '/api'];
};

/**
 * Helper function to get all protected routes
 * Used in middleware for route protection
 */
export const getProtectedRoutes = (): string[] => {
  return [
    RoutePath.grades.base,
    RoutePath.lessons.base,
    RoutePath.homeworkCheck,
    RoutePath.pupilPersonalData.base,
    RoutePath.gradeLeaderboard,
    RoutePath.goldenVersesLibrary.base,
  ];
};

/**
 * Helper function to get all admin routes
 * Used in middleware for route protection
 */
export const getAdminRoutes = (): string[] => {
  return [
    RoutePath.teachersManagement.base,
    RoutePath.pupilsManagement.base,
    RoutePath.familiesManagement.base,
    RoutePath.schoolProcessManagement.base,
  ];
};

