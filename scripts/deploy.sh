#!/usr/bin/env bash
# Build, upload to S3 with sensible cache headers, and invalidate CloudFront.
# Hashed assets are immutable; index.html must always be revalidated.
set -euo pipefail

BUCKET="${BUCKET:-sevens-tactics}"
REGION="${REGION:-af-south-1}"
DISTRIBUTION_ID="${DISTRIBUTION_ID:-E11TFA5I1CL7FZ}"

cd "$(dirname "$0")/.."

pnpm build

# Long-lived, content-hashed assets.
aws s3 sync dist/assets "s3://${BUCKET}/assets" \
  --region "$REGION" --delete \
  --cache-control "public, max-age=31536000, immutable"

# Everything else at the root (index.html, favicon). Short cache so a new deploy shows up fast.
aws s3 sync dist "s3://${BUCKET}" \
  --region "$REGION" --delete --exclude "assets/*" \
  --cache-control "public, max-age=0, must-revalidate"

INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" --paths "/*" \
  --query "Invalidation.Id" --output text)
echo "Invalidation ${INVALIDATION_ID} created for ${DISTRIBUTION_ID}."

DOMAIN=$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" --query "Distribution.DomainName" --output text)
echo "Deployed: https://${DOMAIN}/"
