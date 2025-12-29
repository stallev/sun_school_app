/**
 * AWS Amplify Configuration for Next.js 15.5.9 App Router
 * Supports SSR and Server Actions
 * 
 * Note: This configuration uses AWS Amplify Gen 1 (not Gen 2)
 */

import { Amplify } from 'aws-amplify';
import amplifyConfig from '../../amplifyconfiguration.json';

/**
 * Configure Amplify with SSR support for Next.js App Router
 * This should be called once at the application level
 */
export function configureAmplify() {
  // Configure Amplify with SSR support
  Amplify.configure(amplifyConfig, {
    ssr: true,
  });
}

/**
 * Get Amplify configuration
 * @returns Amplify configuration object
 */
export function getAmplifyConfig() {
  return amplifyConfig;
}

/**
 * Initialize Amplify configuration
 * Call this in root layout or app initialization
 */
if (typeof window === 'undefined') {
  // Server-side: configure once
  configureAmplify();
} else {
  // Client-side: configure once
  configureAmplify();
}

export default Amplify;

