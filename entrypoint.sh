
# Copy files from S3
aws s3 cp s3://$ENV_FILE_BUCKET/.env ./.env
aws s3 cp s3://$CONSTANTS_FILE_BUCKET/constants.ts ./src/lib/constants.ts
aws s3 cp s3://$FAVICON_FILE_BUCKET/favicon.png ./static/favicon.png

chmod +x ./src/lib/constants.ts
cd /app/build

node index.js
