# Pollish

Pollish is a SvelteKit application for creating visual polls and sharing them with a group. Local development uses a temporary SQLite database through Bun; production uses PostgreSQL and a persistent app volume for uploaded images. The interface uses Tailwind CSS v4 with colors and typography based on aaryandehade.com.

## Coolify deployment

Create one Coolify project and production environment on the VPS. Add the PostgreSQL database and Pollish application to the same server and destination network; uploaded images live in an application volume, not a separate service.

1. Add a **PostgreSQL** database resource. Start it, wait until it is healthy, and copy its **Internal URL**. Keep its public port disabled.
2. Add an application from `https://github.com/dehadeaaryan/pollish` on the `main` branch. Select **Dockerfile** as the Build Pack, with the repository root as the Base Directory and `Dockerfile` at the root.
3. Set **Ports Exposes** to `3000`. In **Environment Variables**, add `DATABASE_URL` with the database's Internal URL. The Dockerfile already sets `HOST=0.0.0.0`, `PORT=3000`, and `UPLOAD_DIR=/app/uploads`.
4. Under **Configuration → Persistent Storage**, add a **Volume Mount** with Destination Path `/app/uploads` so uploaded images survive app redeploys.
5. Set the application's domain, enable HTTPS, and deploy. Open the domain and create a test poll with an image to verify the database and volume.

Poll tables are initialized automatically on the first request. Images are saved as JPG, PNG, WebP, or GIF files in the persistent volume; PostgreSQL stores their generated filenames. Uploads are limited to 8 MB.

Poll backgrounds are optional. The editor can use an uploaded image or a solid color, and the selected background appears behind the poll title and choices. Poll titles display in uppercase.

The public poll URL allows visitors to vote and has an Edit button. Poll creators choose either password-protected editing or public editing at creation, and can change this later in the poll builder. Public editing lets anyone with the poll link change the poll's content. The private owner link shown in the builder can always edit, change access settings, and delete the poll; keep it private. Polls created before this access feature remain private-link-only until their owner chooses a new mode.

## Backups

Schedule PostgreSQL backups from the database resource's Backups page. Also back up the app's `/app/uploads` volume and send both backups off the VPS. A backup on the same server does not protect against loss of that server or disk. Test a restore of the database and images.

## Local development

Install dependencies with `bun install`, then run `bun run dev`. The app creates a local SQLite database at `.data/pollish.sqlite` when you create the first poll. Uploaded images go to `.data/uploads`. Both paths are ignored by Git. The local SQLite adapter supports Bun and Node 22.13 or newer, which Vite may use for server actions. To use a different local SQLite file, set `SQLITE_PATH`. To use PostgreSQL locally, set `DATABASE_URL` instead. The production app requires `DATABASE_URL`.

## Voting and journey checks

Voters can switch between Cards, Swipe, and Results. Swipe right to vote yes or left to vote no, using touch or a mouse; buttons also support keyboard navigation. The next card advances after the vote saves. Clicking a selected vote in Cards clears it. Reset my votes clears only the current browser’s votes for that poll and restarts the deck. Votes are remembered with a browser cookie.

With the local server running at `http://localhost:5173`, run `bun run test:ui` for phone-sized creator/visitor flows and desktop swiping. The tests create and delete their own polls; use a disposable database (`SQLITE_PATH=/tmp/pollish-test.sqlite bun run dev`) for testing. Install Chromium with `bunx playwright install chromium` if needed.

Voters may add an optional display name on each poll. Results show that name alongside their choices to everyone with the link. Names are scoped to the poll, can be changed or cleared without changing votes, and do not require an account. Existing votes remain anonymous until their voter adds a name.
