[![Tests](https://github.com/james-langridge/personal-trainer-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/james-langridge/personal-trainer-planner/actions/workflows/ci.yml)

## Personal Trainer Planner

A client management and scheduling app for personal trainers and their clients,
made in collaboration with a real personal trainer (PT).

> **Warning** `Client` in this context means the customer of the PT.

### Features

- Shared calendar between PT and each client, editable by PT only.
- Three calendar event types:
  - `Workouts`, created by PT, which clients can check as done.
  - `Appointments`, with fees for billing.
  - `Bootcamps`, which clients can check to confirm attendance.
- Appointment attendance and fee data is viewable in a monthly table.
- Invoices can be generated and emailed to clients with a button click.
- Mobile-friendly calendar list-view for clients with infinite scroll.
- Custom forms via Contentful CMS, emailed to the PT when the client completes
  them.

### Technology

- Written in **TypeScript**.
- **[Next.js 13](https://nextjs.org/)**.
- **[React 18](https://react.dev/)**.
- State management with **[Redux Toolkit](https://redux-toolkit.js.org/)** and
  **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)**.
- [PostgreSQL](https://www.postgresql.org/) databases.
- ORM using **[Prisma](https://www.prisma.io/)**.
- Authentication using **[NextAuth.js](https://next-auth.js.org/)**.
- Styled using **[Tailwind CSS](https://tailwindcss.com/)**,
  **[Meraki UI](https://merakiui.com/)**, and
  **[shadcn/ui](https://ui.shadcn.com/)** (Radix UI, TanStack Table).

### DevOps

- Deployed on **[Vercel](https://vercel.com/home)**.
- Production and staging databases on **[Railway](https://railway.app/)**.
- Automated database backups, testing and code quality with
  **[GitHub Actions](https://github.com/features/actions)**.

### Screenshots

|                                         |                                         |                                         |
| :-------------------------------------: | :-------------------------------------: | :-------------------------------------: |
| <img src="public/calendarTrainer1.png"> | <img src="public/calendarTrainer2.png"> | <img src="public/calendarTrainer3.png"> |
|   <img src="public/clientsTable.png">   |   <img src="public/clientTable.png">    |  <img src="public/mobileCalendar.png">  |

## Run it locally

### Prerequisites

- You will need a PostgreSQL database.
  - With Railway go to https://railway.app/new and click `Provision PostgreSQL`,
    then click on the new Postgres project, and grab the `DATABASE_URL` from the
    `Connect` tab.
  - Assuming you have
    [PostgreSQL installed](https://www.postgresql.org/download/), you could
    instead create a local database for development with this command:
    - ```sh
      createdb mydatabase
      ```
    - Then you can connect to it:
      `DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/mydatabase`
  - Assuming you have [Docker installed](https://docs.docker.com/get-docker/),
    you could
    [run Postgres in a Docker container](https://hub.docker.com/_/postgres):
    - ```sh
      docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres
      ```
    - Then you can connect to it:
      `DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/mydatabase`
- You will need to set up an email account to work with NextAuth.js. I used
  Gmail. See the [NextAuth.js](https://next-auth.js.org/providers/email) docs
  and the [nodemailer docs](https://nodemailer.com/usage/using-gmail/).
- The app uses Contentful as a CMS for the personal trainer to create forms for
  their clients, which are emailed to the PT on completion. To use this feature
  you will need a [Contentful](https://www.contentful.com/sign-up/) account.

### Installation (basic)

1. Clone the repo
   ```sh
   git clone https://github.com/james-langridge/personal-trainer-planner.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Copy the environment variable files and update the variables.
   ```sh
   cp .env .env.local
   ```
4. Once you have a Postgres DB running somewhere, and the `DATABASE_URL` env var
   set, run the
   [Prisma Migrate command](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-dev):
   ```sh
   npx prisma migrate dev
   ```
5. Change the emails in `prisma/seed.ts` so you will be able to log into the
   app.
6. Seed the database:
   ```sh
   npx prisma db seed
   ```
7. You can check seeding the database worked with this command:
   ```sh
   npx prisma studio
   ```
   You can also edit data using this UI in the browser if needed.
8. Start the development server:
   ```sh
   npm run dev
   ```
9. Open up http://localhost:3000 in a browser and log in. You must have set up
   an email account and set the environment variables before you can log in. See
   the [NextAuth.js](https://next-auth.js.org/providers/email) docs and the
   [nodemailer docs](https://nodemailer.com/usage/using-gmail/). You will be
   admin and can create other users. The seed script added demo workouts etc to
   your admin account.
10. As a Next.js app, deploying to Vercel is simple: https://vercel.com/new

## Deploy your own

You should be able to clone and deploy this project on Vercel using the button
below, provided you have completed the prerequisites above (database and email).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjames-langridge%2Fpersonal-trainer-planner&env=DATABASE_URL,NEXTAUTH_SECRET,SMTP_PASSWORD,SMTP_USER,SMTP_HOST,SMTP_PORT,EMAIL_FROM,EMAIL_TO,CONTENTFUL_SPACE_ID,CONTENTFUL_ACCESS_TOKEN)

Check the deployed project has all the required environment variables, as the
button generator says there cannot be more than 10 Environment Variables per
project, so you will need to manually add the ones from the `.env` that are
missing.

See the [Next.js deployment documentation](https://nextjs.org/docs/deployment)
for more details.

## License

Distributed under the
[MIT License](https://github.com/james-langridge/personal-trainer-planner/blob/main/LICENSE).
