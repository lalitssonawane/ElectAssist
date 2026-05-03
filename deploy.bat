@echo off
echo Starting Deployment Process...

echo.
echo 1. Authenticating with Google Cloud...
gcloud auth login

echo.
echo 2. Setting project to trans-sunset-495213-d4...
gcloud config set project trans-sunset-495213-d4

echo.
echo 3. Deploying to Cloud Run...
gcloud run deploy election-assistant --source . --region us-central1 --allow-unauthenticated

echo.
echo Deployment script finished!
pause
