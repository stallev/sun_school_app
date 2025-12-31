/**
 * Data Access Layer for AWS AppSync GraphQL API
 * Provides type-safe methods for interacting with GraphQL API in Server Actions
 * 
 * Uses AWS Amplify Gen 1 with generateServerClientUsingCookies for SSR support
 */

import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { cookies } from 'next/headers';
import amplifyConfig from '../../amplifyconfiguration.json';

/**
 * GraphQL result type
 */
type GraphQLResult<T = unknown> = {
  data?: T;
  errors?: Array<{ message: string; path?: string[] }>;
};

/**
 * Get Amplify GraphQL client for server-side operations
 * Uses cookies for authentication in Next.js App Router
 */
function getClient() {
  return generateServerClientUsingCookies({
    config: amplifyConfig,
    cookies,
  });
}

/**
 * Execute GraphQL query/mutation
 * @param query - GraphQL query/mutation string
 * @param variables - Variables for the query/mutation
 * @returns GraphQL result
 */
export async function executeGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResult<T>> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/34588026-7cdb-499f-afd6-ebf2aee10626',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'amplify.ts:37',message:'executeGraphQL entry',data:{variables:JSON.stringify(variables||{}),queryLength:query.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  try {
    const client = getClient();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/34588026-7cdb-499f-afd6-ebf2aee10626',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'amplify.ts:43',message:'before client.graphql',data:{hasClient:!!client},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    const result = await client.graphql({
      query,
      variables: variables || {},
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/34588026-7cdb-499f-afd6-ebf2aee10626',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'amplify.ts:48',message:'after client.graphql',data:{hasErrors:'errors' in result && !!result.errors,errorsCount:('errors' in result && result.errors)?result.errors.length:0,errorMessages:('errors' in result && result.errors)?result.errors.map((e: { message: string }) => e.message).join('; '):'none'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    // Check if result has errors property (GraphQLResult)
    if ('errors' in result && result.errors && result.errors.length > 0) {
      const { GraphQLError: GraphQLErrorClass } = await import('./errors');
      const errors = result.errors.map((e: { message: string; path?: readonly (string | number)[] }) => ({
        message: e.message,
        path: e.path ? (Array.isArray(e.path) ? [...e.path] : undefined) : undefined,
      }));
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/34588026-7cdb-499f-afd6-ebf2aee10626',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'amplify.ts:55',message:'throwing GraphQLError',data:{errors:JSON.stringify(errors)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      throw new GraphQLErrorClass(
        `GraphQL errors: ${result.errors.map((e: { message: string }) => e.message).join(', ')}`,
        errors
      );
    }

    // Return result as GraphQLResult (assuming it's a query/mutation, not subscription)
    return result as GraphQLResult<T>;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/34588026-7cdb-499f-afd6-ebf2aee10626',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'amplify.ts:64',message:'executeGraphQL catch',data:{errorType:error instanceof Error?error.constructor.name:'unknown',errorMessage:error instanceof Error?error.message:String(error),errorStringified:JSON.stringify(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    // Re-throw if already a DataAccessError, otherwise parse and wrap
    const { parseError } = await import('./errors');
    throw parseError(error);
  }
}

/**
 * Model name to query/mutation name mapping
 * Used for type inference only
 */
const _MODEL_NAMES = {
  User: 'User',
  Grade: 'Grade',
  AcademicYear: 'AcademicYear',
  Lesson: 'Lesson',
  Book: 'Book',
  GoldenVerse: 'GoldenVerse',
  LessonGoldenVerse: 'LessonGoldenVerse',
  LessonFile: 'LessonFile',
  Pupil: 'Pupil',
  HomeworkCheck: 'HomeworkCheck',
  Achievement: 'Achievement',
  PupilAchievement: 'PupilAchievement',
  Family: 'Family',
  FamilyMember: 'FamilyMember',
  UserGrade: 'UserGrade',
  UserFamily: 'UserFamily',
  GradeEvent: 'GradeEvent',
  GradeSettings: 'GradeSettings',
} as const;

type ModelName = keyof typeof _MODEL_NAMES;

/**
 * Universal Data Access Layer
 * Provides type-safe CRUD operations for all GraphQL models
 */
export const amplifyData = {
  /**
   * Create a new record
   * @param model - Model name (e.g., 'User', 'Grade', 'Lesson')
   * @param input - Input data for creation
   * @returns Created record
   */
  async create<T extends ModelName>(
    model: T,
    input: Record<string, unknown>
  ): Promise<unknown> {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/34588026-7cdb-499f-afd6-ebf2aee10626',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'amplify.ts:107',message:'amplifyData.create entry',data:{model,inputKeys:Object.keys(input),inputStructure:JSON.stringify(input)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const mutationName = `create${model}`;
    const mutations = await import('../../graphql/mutations');
    const mutation = (mutations as Record<string, string>)[mutationName];

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/34588026-7cdb-499f-afd6-ebf2aee10626',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'amplify.ts:115',message:'mutation check',data:{mutationName,mutationFound:!!mutation},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    if (!mutation) {
      throw new Error(`Mutation ${mutationName} not found`);
    }

    // Check if input already has 'input' and 'condition' keys (from mutations.ts)
    // If so, use it directly as GraphQL variables
    // Otherwise, wrap it in { input }
    const graphQLVariables = 'input' in input && typeof input.input === 'object'
      ? input
      : { input };

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/34588026-7cdb-499f-afd6-ebf2aee10626',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'amplify.ts:125',message:'before executeGraphQL (fixed)',data:{graphQLVariables:JSON.stringify(graphQLVariables),isWrapped:'input' in input},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    const result = await executeGraphQL<Record<string, unknown>>(mutation, graphQLVariables);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/34588026-7cdb-499f-afd6-ebf2aee10626',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'amplify.ts:130',message:'after executeGraphQL (fixed)',data:{hasData:!!result.data,dataKeys:result.data?Object.keys(result.data):[],hasErrors:!!result.errors},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    const dataKey = mutationName.charAt(0).toLowerCase() + mutationName.slice(1);
    return result.data?.[dataKey];
  },

  /**
   * Get a record by ID
   * @param model - Model name
   * @param id - Record ID
   * @returns Record or null if not found
   */
  async get<T extends ModelName>(
    model: T,
    id: string
  ): Promise<unknown | null> {
    const queryName = `get${model}`;
    const queries = await import('../../graphql/queries');
    const query = (queries as Record<string, string>)[queryName];

    if (!query) {
      throw new Error(`Query ${queryName} not found`);
    }

    const result = await executeGraphQL<Record<string, unknown>>(query, {
      id,
    });

    const dataKey = queryName.charAt(0).toLowerCase() + queryName.slice(1);
    return result.data?.[dataKey] || null;
  },

  /**
   * List records with optional filter
   * @param model - Model name
   * @param filter - Optional filter object
   * @param limit - Optional limit
   * @param nextToken - Optional pagination token
   * @returns List of records with pagination info
   */
  async list<T extends ModelName>(
    model: T,
    filter?: Record<string, unknown>,
    limit?: number,
    nextToken?: string
  ): Promise<{ items: unknown[]; nextToken?: string | null } | null> {
    const queryName = `list${model}s`;
    const queries = await import('../../graphql/queries');
    const query = (queries as Record<string, string>)[queryName];

    if (!query) {
      throw new Error(`Query ${queryName} not found`);
    }

    const result = await executeGraphQL<Record<string, unknown>>(query, {
      filter,
      limit,
      nextToken,
    });

    const dataKey = queryName.charAt(0).toLowerCase() + queryName.slice(1);
    return (result.data?.[dataKey] as { items: unknown[]; nextToken?: string | null }) || null;
  },

  /**
   * Update a record
   * @param model - Model name
   * @param input - Update input (must include id)
   * @returns Updated record
   */
  async update<T extends ModelName>(
    model: T,
    input: Record<string, unknown>
  ): Promise<unknown> {
    const mutationName = `update${model}`;
    const mutations = await import('../../graphql/mutations');
    const mutation = (mutations as Record<string, string>)[mutationName];

    if (!mutation) {
      throw new Error(`Mutation ${mutationName} not found`);
    }

    // Check if input already has 'input' and 'condition' keys (from mutations.ts)
    // If so, use it directly as GraphQL variables
    // Otherwise, wrap it in { input }
    const graphQLVariables = 'input' in input && typeof input.input === 'object'
      ? input
      : { input };

    const result = await executeGraphQL<Record<string, unknown>>(mutation, graphQLVariables);

    const dataKey = mutationName.charAt(0).toLowerCase() + mutationName.slice(1);
    return result.data?.[dataKey];
  },

  /**
   * Delete a record
   * @param model - Model name
   * @param id - Record ID
   * @returns Deleted record
   */
  async delete<T extends ModelName>(
    model: T,
    id: string
  ): Promise<unknown> {
    const mutationName = `delete${model}`;
    const mutations = await import('../../graphql/mutations');
    const mutation = (mutations as Record<string, string>)[mutationName];

    if (!mutation) {
      throw new Error(`Mutation ${mutationName} not found`);
    }

    const result = await executeGraphQL<Record<string, unknown>>(mutation, {
      input: { id },
    });

    const dataKey = mutationName.charAt(0).toLowerCase() + mutationName.slice(1);
    return result.data?.[dataKey];
  },

  // Legacy methods for backward compatibility with existing code
  /**
   * Create a book (legacy method)
   * @deprecated Use amplifyData.create('Book', input) instead
   */
  async createBook(input: {
    fullName: string;
    shortName: string;
    abbreviation: string;
    testament: string;
    order: number;
  }) {
    return this.create('Book', input);
  },

  /**
   * List all books (legacy method)
   * @deprecated Use amplifyData.list('Book', filter) instead
   */
  async listBooks(filter?: {
    testament?: { eq: string };
    shortName?: { eq: string };
  }) {
    return this.list('Book', filter);
  },
};
