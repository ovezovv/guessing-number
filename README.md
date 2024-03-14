# Guessing Number Backend

## Installation Steps
- Clone the repo on your local machine, make sure you are cloning project from `main` branch.
- Enter into the project and run:
```
npm run install
```

- Copy `.env.example` file and rename it to `.env`, then enter credentials according to your local setup, for example:

```.env
HOST="localhost"
PORT=8000
MONGODB_URL="mongodb://localhost:27017/guessing-number"
```
- Run the comman below for generating Swagger Documentation:
```
npm run swagger
``` 

- After all you are good to go with development start:
```
npm run dev
```

- API Endpoint will be in that case `http://localhost:8000/api` for requests to send from client or mobile application.

## Development Flow & Feature Implementation
- If you are intended to make changes, please create a new branch besides `main` branch, and follow naming convention for creating new branch:
  - `feat/something` -> for feature related changes
  - `chore/somoething` -> for chore changes or logic changes
  - `fix/something` -> for fixes and solving big issues
  - `refactor/something` -> for refactoring specific part of code
  - `test/something` -> for tests detox, integration and etc.

***Note: Never push any code to the `main` branch, always create new branch and request for a review.
- If you notice something should be fixed or improved, please create an issue about it and tag me there also.
- If you already come up with a solution for your found issue then please create a pull request and tag me inside PRs comment.
