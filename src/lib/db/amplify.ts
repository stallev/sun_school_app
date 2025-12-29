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
  try {
    const client = getClient();
    const result = await client.graphql({
      query,
      variables: variables || {},
    });

    // Check if result has errors property (GraphQLResult)
    if ('errors' in result && result.errors && result.errors.length > 0) {
      const { GraphQLError: GraphQLErrorClass } = await import('./errors');
      const errors = result.errors.map((e: { message: string; path?: readonly (string | number)[] }) => ({
        message: e.message,
        path: e.path ? (Array.isArray(e.path) ? [...e.path] : undefined) : undefined,
      }));
      throw new GraphQLErrorClass(
        `GraphQL errors: ${result.errors.map((e: { message: string }) => e.message).join(', ')}`,
        errors
      );
    }

    // Return result as GraphQLResult (assuming it's a query/mutation, not subscription)
    return result as GraphQLResult<T>;
  } catch (error) {
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
    const mutationName = `create${model}`;
    const mutations = await import('../../graphql/mutations');
    const mutation = (mutations as Record<string, string>)[mutationName];

    if (!mutation) {
      throw new Error(`Mutation ${mutationName} not found`);
    }

    const result = await executeGraphQL<Record<string, unknown>>(mutation, {
      input,
    });

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

    const result = await executeGraphQL<Record<string, unknown>>(mutation, {
      input,
    });

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
