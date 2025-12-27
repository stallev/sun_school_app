/**
 * Data Access Layer for AWS AppSync GraphQL API
 * Provides type-safe methods for interacting with GraphQL API in Server Actions
 */

import amplifyConfig from '../../amplifyconfiguration.json';

/**
 * GraphQL result type
 */
type GraphQLResult<T = unknown> = {
  data?: T;
  errors?: Array<{ message: string; path?: string[] }>;
};

/**
 * Execute GraphQL query/mutation against AppSync endpoint
 * @param query - GraphQL query/mutation string
 * @param variables - Variables for the query/mutation
 * @returns GraphQL result
 */
export async function executeGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResult<T>> {
  const endpoint = amplifyConfig.aws_appsync_graphqlEndpoint;
  const region = amplifyConfig.aws_appsync_region;
  const authType = amplifyConfig.aws_appsync_authenticationType;

  // Get authentication token from cookies
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const idToken = cookieStore.get('cognito-id-token')?.value;

  if (!idToken && authType === 'AMAZON_COGNITO_USER_POOLS') {
    throw new Error('Unauthorized: No authentication token found');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authType === 'AMAZON_COGNITO_USER_POOLS' && idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result = (await response.json()) as GraphQLResult<T>;

  if (result.errors && result.errors.length > 0) {
    throw new Error(
      `GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`
    );
  }

  return result;
}

/**
 * Data access layer for Books
 */
export const amplifyData = {
  /**
   * Create a book
   */
  async createBook(input: {
    fullName: string;
    shortName: string;
    abbreviation: string;
    testament: string;
    order: number;
  }) {
    const { createBook } = await import('../../graphql/mutations');
    const result = await executeGraphQL<{ createBook: unknown }>(createBook, {
      input,
    });

    return result.data?.createBook;
  },

  /**
   * List all books
   */
  async listBooks(filter?: {
    testament?: { eq: string };
    shortName?: { eq: string };
  }) {
    const { listBooks } = await import('../../graphql/queries');
    const result = await executeGraphQL<{ listBooks: { items: unknown[] } }>(
      listBooks,
      {
        filter,
      }
    );

    return result.data?.listBooks;
  },
};

