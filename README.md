[![Tests](https://github.com/james-langridge/personal-trainer-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/james-langridge/personal-trainer-planner/actions/workflows/ci.yml)

## Personal Trainer Planner

A single-tenant Next.js app for personal trainers to schedule and track events,
and manage and invoice trainees. Made in collaboration with and used in
production by a real [personal trainer](https://www.fitforlifetrainer.co.uk/)
(**PT**).

### Features

- Shared calendar between PT and each trainee, editable by PT only.
- Three calendar event types:
  - `Workouts`, created by PT, which trainees can check off as completed.
  - `Appointments`, with fees for billing.
  - `Bootcamps`, which trainees can check to confirm attendance, if they have
    enough credits.
- Appointment attendance and fee data is viewable in a monthly table.
- Invoices can be generated and emailed to trainees with a button click.
- Mobile-friendly calendar list-view for trainees.
- Custom forms via Contentful CMS, emailed to the PT when the trainee completes
  them.

### Technology

- Built with **[Next.js 15](https://nextjs.org/)** and
  **[React 19](https://react.dev/)**.
- Written in **[TypeScript](https://www.typescriptlang.org/)**.
- Data persistence with **[PostgreSQL](https://www.postgresql.org/)**.
- ORM using **[Prisma](https://www.prisma.io/)**.
- Authentication using **[Auth.js](https://authjs.dev/)**.
- Styled using **[Tailwind CSS](https://tailwindcss.com/)**,
  **[Meraki UI](https://merakiui.com/)**, and
  **[shadcn/ui](https://ui.shadcn.com/)**.

### DevOps

- Deployed on **[Vercel](https://vercel.com/home)**.
- Production and staging databases on **[Railway](https://railway.app/)**.
- Automated database backups, testing and code quality with
  **[GitHub Actions](https://github.com/features/actions)**.

### Roadmap

- Migrate to multi-tenancy.

### Screenshots

|                                         |                                         |                                         |
| :-------------------------------------: | :-------------------------------------: | :-------------------------------------: |
| <img src="public/calendarTrainer1.png"> | <img src="public/calendarTrainer2.png"> | <img src="public/calendarTrainer3.png"> |
|   <img src="public/clientsTable.png">   |   <img src="public/clientTable.png">    |  <img src="public/mobileCalendar.png">  |

## Run it locally

### Prerequisites

- For the forgot-password api, and emailing invoices and forms, you will need to
  set up an email account for use with nodemailer. See the
  [Auth.js](https://next-auth.js.org/providers/email) docs and the
  [nodemailer docs](https://nodemailer.com/usage/using-gmail/).
- The app uses Contentful as a CMS for the trainer to create forms for their
  clients, which are emailed to the trainer on completion. To use this feature
  you will need a [Contentful](https://www.contentful.com/sign-up/) account.

### Steps

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
   ```
4. Create a postgres db in a Docker container:
   ```sh
   docker run --name ptp-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ptp -p 5432:5432 -d postgres
   ```
5. Set the `DATABASE_URL` in your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ptp
   ```
6. Run the
   [Prisma Migrate command](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-dev):
   ```sh
   npx prisma migrate dev
   ```
7. Seed the database:
   ```sh
   npx prisma db seed
   ```
8. Start the development server:
   ```sh
   npm run dev
   ```
9. Open up http://localhost:3000 in a browser and log in with the email and
   password from the seed script.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjames-langridge%2Fpersonal-trainer-planner&env=DATABASE_URL,NEXTAUTH_SECRET,SMTP_PASSWORD,SMTP_USER,SMTP_HOST,SMTP_PORT,EMAIL_FROM,EMAIL_TO,CONTENTFUL_SPACE_ID,CONTENTFUL_ACCESS_TOKEN)

See the [Next.js deployment documentation](https://nextjs.org/docs/deployment)
for more details.

## License

Distributed under the
[MIT License](https://github.com/james-langridge/personal-trainer-planner/blob/main/LICENSE).
