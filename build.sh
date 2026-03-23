#!/bin/bash
set -e

REGISTRY="central-harbor.ext.synthlane.com/internal"
IMAGE_NAME="ivorynoise-com"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"


echo "Building Docker image..."

docker build \
    -f Dockerfile \
    -t "$REGISTRY/$IMAGE_NAME:latest" .
docker build \
    --build-arg NEXT_PUBLIC_IVORYNOISE_COM_API_URL="$NEXT_PUBLIC_IVORYNOISE_COM_API_URL" \
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
