# Use Node.js Alpine image as base
FROM node:18-alpine

# Copy the Stockfish binary from the host into the image
COPY stockfish_14_x64_popcnt /bin/stockfish

# Install musl-dev and libc6-compat to run the Stockfish binary
RUN apk add musl-dev libc6-compat 

# Set executable permissions on the Stockfish binary
RUN chmod +x /bin/stockfish

# Add /bin/ to the PATH
ENV PATH="/bin/:${PATH}"

# This docker image is available on Docker Hub as "carbrex/sf-on-node-alpine"