# Iron Vault Security

This site now includes:

- Login and sign up entry points
- Standalone `login.html` and `signup.html` auth pages
- A simulated cargo tracking dashboard
- Editable delivery updates
- A client asset register that grows as assets are added
- API-backed signup and contact capture for Vercel

## Local use

1. Run `npm install`
2. Start with `vercel dev`
3. Open the local site and use the dashboard forms

When you run locally, dashboard data is saved to [data/dashboard.json](/c:/Users/Mr.%20Apau/Documents/GitHub/Sheild-Approved/data/dashboard.json:1) and auth users are saved to [data/users.json](/c:/Users/Mr.%20Apau/Documents/GitHub/Sheild-Approved/data/users.json:1).

## Vercel deployment

The frontend sends requests to `/api/dashboard`, `/api/auth`, and `/api/users`.

To make the data persist on Vercel:

1. Create a public Vercel Blob store in your Vercel project dashboard.
2. Connect the Blob store to this project so `BLOB_READ_WRITE_TOKEN` is added automatically.
3. Deploy the project.

After that, the API will store dashboard snapshots in Vercel Blob instead of local JSON.

## Notes

- The delivery tracker is simulated in the browser and keeps increasing progress for active shipments.
- Login and signup are handled by HTML pages that call the auth API and store the signed-in user in browser local storage.
- Shipment, signup, contact, and asset updates are all posted through the dashboard API route.
- The current Blob implementation uses stored JSON snapshots for simple setup. For production private client records, move sensitive data to a proper database with authentication.
