#!/bin/bash
set -e

REGISTRY="central-harbor.ext.synthlane.com/internal"
IMAGE_NAME="ivorynoise-com"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"
cd "$REPO_ROOT"

: "${NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN:?NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not set (PostHog project API key)}"
: "${BREVO_API_KEY:?BREVO_API_KEY is not set (Brevo API key for /api/newsletter)}"
: "${BREVO_LIST_ID:?BREVO_LIST_ID is not set (Brevo list id — CRM → Lists)}"
POSTHOG_HOST="${NEXT_PUBLIC_POSTHOG_HOST:-https://us.i.posthog.com}"

echo "Building Docker image..."

docker build \
  --build-arg NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="$NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN" \
  --build-arg NEXT_PUBLIC_POSTHOG_HOST="$POSTHOG_HOST" \
  --build-arg BREVO_API_KEY="$BREVO_API_KEY" \
  --build-arg BREVO_LIST_ID="$BREVO_LIST_ID" \
  -f Dockerfile \
  -t "$REGISTRY/$IMAGE_NAME:latest" .

if [ -n "$1" ]; then
  TAG="$1"
else
  echo "Check this https://central-harbor.ext.synthlane.com/harbor/projects/2/repositories/$IMAGE_NAME/artifacts-tab"
  read -p "Enter tag to push (e.g., 1.0.0-dev, or 'skip' to skip pushing): " TAG
fi

if [ "$TAG" = "skip" ]; then
  echo "Skipping push."
  exit 0
fi

docker tag "$REGISTRY/$IMAGE_NAME:latest" "$REGISTRY/$IMAGE_NAME:$TAG"

echo "Pushing images..."
docker push "$REGISTRY/$IMAGE_NAME:latest"
docker push "$REGISTRY/$IMAGE_NAME:$TAG"

echo "Done! Pushed:"
echo "  - $REGISTRY/$IMAGE_NAME:latest"
echo "  - $REGISTRY/$IMAGE_NAME:$TAG"
