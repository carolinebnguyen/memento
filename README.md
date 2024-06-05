# Memento

## About Memento

Memento is a social media web application that allows users to share photos and text statuses with the world.

## Tech Stack

- DynamoDB
- Express
- React
- Node.js

## How to Set Up AWS Environment

1. Create or sign in with an AWS account
2. Obtain an access key and add the credentials to the `.env` file as outlined below
3. Set up Cognito user pool
4. Set up DynamoDB tables

- #### User
  - Partition key: username (String)
  - Global secondary indexes:
    - email-index:
      - Partition key: email (String)
- #### Post
  - Partition key: username (String)
  - Sort key: postId (String)
  - Global secondary indexes:
    - postId-index:
      - Partition key: postId (String)
- #### Comment
  - Partition key: commentId (String)
  - Global secondary indexes:
    - postId-index:
      - Partition key: postId (String)
- #### Notification
  - Partition key: recipient (String)
  - Sort key: notificationId (String)
  - Global secondary indexes:
    - postId-index:
      - Partition key: postId (String)
- #### Conversation
  - Partition key: conversationId (String)
  - Global secondary indexes:
    - participantKey-index:
      - Partition key: participantKey (String)

5. Set up S3 bucket
6. Add a `.env` file to the root of the `server` folder with the following keys

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`
- `COGNITO_CLIENT_ID`
- `COGNITO_CLIENT_SECRET`
- `COGNITO_USER_POOL_ID`

# How to Start App

1. Run `npm run frontend-dev` to start the front end
2. Run `npm run backend-dev` to start the back end
