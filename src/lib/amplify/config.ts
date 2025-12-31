/**
 * AWS Amplify Configuration for Next.js 15.5.9 App Router
 * Supports SSR and Server Actions
 * 
 * Note: This configuration uses AWS Amplify Gen 1 (not Gen 2)
 * 
 * Performance optimization: Configuration is done once per environment
 * (server-side and client-side are separate instances)
 */

import { Amplify } from 'aws-amplify';
import amplifyConfig from '../../amplifyconfiguration.json';

// Track if Amplify has been configured to avoid multiple configurations
let isConfigured = false;

/**
 * Configure Amplify with SSR support for Next.js App Router
 * This function is idempotent - it only configures once per environment
 * 
 * @param force - Force reconfiguration even if already configured (default: false)
 */
export function configureAmplify(force = false) {
  // Skip if already configured (unless forced)
  if (isConfigured && !force) {
    return;
  }

  // Configure Amplify with SSR support
  Amplify.configure(amplifyConfig, {
    ssr: true,
  });

  isConfigured = true;
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
 * This runs once when the module is loaded
 * Separate instances for server-side and client-side
 */
if (typeof window === 'undefined') {
  // Server-side: configure once
  configureAmplify();
} else {
  // Client-side: configure once
  configureAmplify();
}

export default Amplify;

