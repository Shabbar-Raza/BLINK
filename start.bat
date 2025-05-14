@echo off
start cmd /k "python app/api/topics/[topicId]/process/route.py"
start cmd /k "npm run dev" 