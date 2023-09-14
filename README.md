[![Tests](https://github.com/james-langridge/personal-trainer-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/james-langridge/personal-trainer-planner/actions/workflows/ci.yml)

## About The Project

A client management and scheduling app for personal trainers and their clients, made in collaboration with a real personal trainer (PT), with the new Next.js 13 features like the [App Router](https://nextjs.org/docs/app/building-your-application/routing) and [React Server Components](https://nextjs.org/docs/getting-started/react-essentials).

> **Warning**
> This app is a work in progress, and uses new Next.js 13 and React 18 features that could be unstable.

### Features

Client in this context means the customer of the PT.

- Shared calendar between PT and each client, editable by PT only.
- Three event types:
  - Workouts, which clients can check as done.
  - Appointments, with fees for billing.
  - Bootcamps, which clients can check to confirm attendance.
- Appointment attendance and fee data is viewable in a monthly table.
- Invoices can be generated and emailed to clients with a button click.
- Mobile-friendly calendar list-view for clients with infinite scroll.
- Password-less login via email magic link.
- Custom forms via Contentful CMS, emailed to the PT when the client completes them.
- Authentication using **[NextAuth.js](https://next-auth.js.org/)**.
- ORM using **[Prisma](https://www.prisma.io/)**.
- Database on **[Railway](https://railway.app/)**.
- Styled using **[Tailwind CSS](https://tailwindcss.com/)**, **[Meraki UI](https://merakiui.com/)**, and **[shadcn/ui](https://ui.shadcn.com/)** (Radix UI, TanStack Table).
- State management with **[Redux Toolkit](https://redux-toolkit.js.org/)** and **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)**.
- Written in **TypeScript**.

### Showcase

![calendar_trainer1](public/calendarTrainer1.png)

![calendar_trainer2](public/calendarTrainer2.png)

![calendar_trainer3](public/calendarTrainer3.png)

![clients_table](public/clientsTable.png)

![client_table](public/clientTable.png)

![mobile_calendar](public/mobileCalendar.png) ![mobile_session](public/mobileSession.png)

## Run it locally

### Prerequisites

- You will need a PostgreSQL database.
- You will need to set up an email account to work with NextAuth.js. I used Gmail.  See the [NextAuth.js](https://next-auth.js.org/providers/email) docs and the [nodemailer docs](https://nodemailer.com/usage/using-gmail/).
- The app uses Contentful as a CMS for the personal trainer to create forms for their clients, which are emailed to the PT on completion.  To use this feature you will need a [Contentful](https://www.contentful.com/sign-up/) account.

### Installation

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
    cp .env.example .env
    cp .env.local.example .env.local
    ```
4. Once you have a Postgres DB running somewhere, and the `DATABASE_URL` env var set, run the [Prisma Migrate command](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-dev):
    ```sh
    npx prisma migrate dev
    ```
5. Change the emails in `prisma/seed.ts` so you will be able to log into the app.
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
9. Open up http://localhost:3000 in a browser and log in.  You must have set up an email account and set the environment variables before you can log in.  See the [NextAuth.js](https://next-auth.js.org/providers/email) docs and the [nodemailer docs](https://nodemailer.com/usage/using-gmail/).  You will be admin and can create other users.  The seed script added demo workouts etc to your admin account.

## Deploy your own

You should be able to clone and deploy this project on Vercel using the button below, provided you have completed the prerequisites above (database and email).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjames-langridge%2Fpersonal-trainer-planner&env=DATABASE_URL,NEXTAUTH_SECRET,SMTP_PASSWORD,SMTP_USER,SMTP_HOST,SMTP_PORT,EMAIL_FROM,EMAIL_TO,CONTENTFUL_SPACE_ID,CONTENTFUL_ACCESS_TOKEN)

Check the deployed project has all the required environment variables, as the button generator says there cannot be more than 10 Environment Variables per project, so you will need to manually add the ones from the `.env.example` that are missing.

See the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

Distributed under the [MIT License](https://github.com/james-langridge/personal-trainer-planner/blob/main/LICENSE).
