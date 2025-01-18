Backend
Installation Steps

Step 1: Clone Repository

git clone <repository-url>
cd <repository-folder>/backend

Step 2: Install Dependencies
npm install

Step 3: Set Up Env Variables

Create a .env file in the backend directory.
Add the following environment variables:
DATABASE_USERNAME=<your-database-username>
DATABASE_PASSWORD=<your-database-password>
DATABASE_HOST=<your-database-host>
DATABASE_NAME=<your-database-name>
JWT_SECRET=<your-jwt-secret>

Step 4: Run the Application
npm run start:dev
