#!/bin/bash

npm run lint && \
npm run build && \
scripts/setup/health-checks.sh
