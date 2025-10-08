#!/bin/bash
cd /home/kavia/workspace/code-generation/nutrition-connect-platform-173001-173010/nutrition_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

