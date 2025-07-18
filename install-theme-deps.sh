#!/bin/bash

# Script to install all the required packages for the modern theme

echo "Installing dependencies for Agropal modern dark theme..."

# Navigate to the frontend directory
cd frontend

# Install the required packages
npm install --save \
  @emotion/react \
  @emotion/styled \
  framer-motion \
  lottie-react \
  notistack \
  react-intersection-observer \
  react-spring \
  react-transition-group

# Install dev dependencies
npm install --save-dev \
  @types/react-transition-group

echo "All dependencies installed successfully!"
echo "To apply the theme, rebuild the frontend by running: npm run build"

# Return to the root directory
cd ..
