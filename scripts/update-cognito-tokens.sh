#!/bin/bash

# Script to update Cognito User Pool Client Token Settings
# Usage: ./scripts/update-cognito-tokens.sh <USER_POOL_ID> <CLIENT_ID> <REGION>
# Example: ./scripts/update-cognito-tokens.sh us-east-1_FORzY4ey4 5hq66dq341pt5peavra3bqpd7b us-east-1

set -e  # Exit on error

USER_POOL_ID=$1
CLIENT_ID=$2
REGION=$3

# Validate parameters
if [ -z "$USER_POOL_ID" ] || [ -z "$CLIENT_ID" ] || [ -z "$REGION" ]; then
  echo "Error: USER_POOL_ID, CLIENT_ID and REGION are required"
  echo "Usage: ./scripts/update-cognito-tokens.sh <USER_POOL_ID> <CLIENT_ID> <REGION>"
  exit 1
fi

# Token expiration settings
ID_TOKEN_VALIDITY=24        # 1 day in hours
ACCESS_TOKEN_VALIDITY=24    # 1 day in hours
REFRESH_TOKEN_VALIDITY=30   # 30 days

echo "=========================================="
echo "Updating Cognito Token Settings"
echo "User Pool ID: $USER_POOL_ID"
echo "Client ID: $CLIENT_ID"
echo "Region: $REGION"
echo "Date: $(date)"
echo "=========================================="
echo ""

echo "Target token expiration settings:"
echo "  ID Token: $ID_TOKEN_VALIDITY hours (1 day)"
echo "  Access Token: $ACCESS_TOKEN_VALIDITY hours (1 day)"
echo "  Refresh Token: $REFRESH_TOKEN_VALIDITY days"
echo ""

# Check current settings
echo "Checking current token settings..."
if CURRENT_CONFIG=$(aws cognito-idp describe-user-pool-client \
  --user-pool-id "$USER_POOL_ID" \
  --client-id "$CLIENT_ID" \
  --region "$REGION" \
  --output json 2>/dev/null); then
  
  CURRENT_ID_TOKEN=$(echo "$CURRENT_CONFIG" | jq -r '.UserPoolClient.IdTokenValidity')
  CURRENT_ACCESS_TOKEN=$(echo "$CURRENT_CONFIG" | jq -r '.UserPoolClient.AccessTokenValidity')
  CURRENT_REFRESH_TOKEN=$(echo "$CURRENT_CONFIG" | jq -r '.UserPoolClient.RefreshTokenValidity')
  CURRENT_ID_UNIT=$(echo "$CURRENT_CONFIG" | jq -r '.UserPoolClient.TokenValidityUnits.IdToken')
  CURRENT_ACCESS_UNIT=$(echo "$CURRENT_CONFIG" | jq -r '.UserPoolClient.TokenValidityUnits.AccessToken')
  CURRENT_REFRESH_UNIT=$(echo "$CURRENT_CONFIG" | jq -r '.UserPoolClient.TokenValidityUnits.RefreshToken')
  
  echo "Current settings:"
  echo "  ID Token: $CURRENT_ID_TOKEN $CURRENT_ID_UNIT"
  echo "  Access Token: $CURRENT_ACCESS_TOKEN $CURRENT_ACCESS_UNIT"
  echo "  Refresh Token: $CURRENT_REFRESH_TOKEN $CURRENT_REFRESH_UNIT"
  echo ""
  
  # Check if update is needed
  NEEDS_UPDATE=false
  if [ "$CURRENT_ID_UNIT" = "hours" ] && [ "$CURRENT_ID_TOKEN" -ne "$ID_TOKEN_VALIDITY" ]; then
    NEEDS_UPDATE=true
  fi
  if [ "$CURRENT_ACCESS_UNIT" = "hours" ] && [ "$CURRENT_ACCESS_TOKEN" -ne "$ACCESS_TOKEN_VALIDITY" ]; then
    NEEDS_UPDATE=true
  fi
  if [ "$CURRENT_REFRESH_UNIT" = "days" ] && [ "$CURRENT_REFRESH_TOKEN" -ne "$REFRESH_TOKEN_VALIDITY" ]; then
    NEEDS_UPDATE=true
  fi
  
  if [ "$NEEDS_UPDATE" = false ]; then
    echo "✓ Token settings are already configured correctly. No update needed."
    echo ""
    exit 0
  fi
else
  echo "⚠ Could not retrieve current settings. Proceeding with update..."
  echo ""
fi

# Update token settings
echo "Updating token settings..."

aws cognito-idp update-user-pool-client \
  --user-pool-id "$USER_POOL_ID" \
  --client-id "$CLIENT_ID" \
  --id-token-validity "$ID_TOKEN_VALIDITY" \
  --access-token-validity "$ACCESS_TOKEN_VALIDITY" \
  --refresh-token-validity "$REFRESH_TOKEN_VALIDITY" \
  --token-validity-units IdToken=hours,AccessToken=hours,RefreshToken=days \
  --region "$REGION" \
  >/dev/null

if [ $? -eq 0 ]; then
  echo "✓ Token settings updated successfully"
  echo ""
  
  # Verify update
  echo "Verifying updated settings..."
  UPDATED_CONFIG=$(aws cognito-idp describe-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-id "$CLIENT_ID" \
    --region "$REGION" \
    --output json)
  
  UPDATED_ID_TOKEN=$(echo "$UPDATED_CONFIG" | jq -r '.UserPoolClient.IdTokenValidity')
  UPDATED_ACCESS_TOKEN=$(echo "$UPDATED_CONFIG" | jq -r '.UserPoolClient.AccessTokenValidity')
  UPDATED_REFRESH_TOKEN=$(echo "$UPDATED_CONFIG" | jq -r '.UserPoolClient.RefreshTokenValidity')
  UPDATED_ID_UNIT=$(echo "$UPDATED_CONFIG" | jq -r '.UserPoolClient.TokenValidityUnits.IdToken')
  UPDATED_ACCESS_UNIT=$(echo "$UPDATED_CONFIG" | jq -r '.UserPoolClient.TokenValidityUnits.AccessToken')
  UPDATED_REFRESH_UNIT=$(echo "$UPDATED_CONFIG" | jq -r '.UserPoolClient.TokenValidityUnits.RefreshToken')
  
  echo "Updated settings:"
  echo "  ID Token: $UPDATED_ID_TOKEN $UPDATED_ID_UNIT"
  echo "  Access Token: $UPDATED_ACCESS_TOKEN $UPDATED_ACCESS_UNIT"
  echo "  Refresh Token: $UPDATED_REFRESH_TOKEN $UPDATED_REFRESH_UNIT"
else
  echo "✗ Failed to update token settings"
  exit 1
fi

echo ""
echo "=========================================="
echo "Token settings update completed!"
echo "=========================================="

