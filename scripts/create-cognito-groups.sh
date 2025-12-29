#!/bin/bash

# Script to create Cognito User Pool Groups
# Usage: ./scripts/create-cognito-groups.sh <USER_POOL_ID> <REGION>
# Example: ./scripts/create-cognito-groups.sh us-east-1_FORzY4ey4 us-east-1

set -e  # Exit on error

USER_POOL_ID=$1
REGION=$2

# Validate parameters
if [ -z "$USER_POOL_ID" ] || [ -z "$REGION" ]; then
  echo "Error: USER_POOL_ID and REGION are required"
  echo "Usage: ./scripts/create-cognito-groups.sh <USER_POOL_ID> <REGION>"
  exit 1
fi

echo "=========================================="
echo "Creating Cognito Groups"
echo "User Pool ID: $USER_POOL_ID"
echo "Region: $REGION"
echo "Date: $(date)"
echo "=========================================="
echo ""

# Function to create group (idempotent)
create_group() {
  local group_name=$1
  local description=$2
  local precedence=$3

  echo "Creating group: $group_name..."
  
  # Check if group already exists
  if aws cognito-idp get-group \
    --user-pool-id "$USER_POOL_ID" \
    --group-name "$group_name" \
    --region "$REGION" \
    >/dev/null 2>&1; then
    echo "  ✓ Group '$group_name' already exists, skipping..."
  else
    aws cognito-idp create-group \
      --user-pool-id "$USER_POOL_ID" \
      --group-name "$group_name" \
      --description "$description" \
      --precedence "$precedence" \
      --region "$REGION"
    
    if [ $? -eq 0 ]; then
      echo "  ✓ Group '$group_name' created successfully"
    else
      echo "  ✗ Failed to create group '$group_name'"
      exit 1
    fi
  fi
  echo ""
}

# Create TEACHER group
create_group "TEACHER" "Sunday School Teachers" 1

# Create ADMIN group
create_group "ADMIN" "Sunday School Administrators" 2

# Create SUPERADMIN group
create_group "SUPERADMIN" "Sunday School Super Administrators" 3

echo "=========================================="
echo "All groups created successfully!"
echo "=========================================="

