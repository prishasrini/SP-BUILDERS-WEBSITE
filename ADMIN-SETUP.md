# Admin page setup

The website has an admin page at **/admin** (for example `https://sp-builders-website.vercel.app/admin`).
From there you can add, edit, reorder and delete projects (with photos), change the text on every page,
and update the phone, WhatsApp, email and address. Changes appear on the website as soon as you press
**Save changes**. No code or redeploy is needed.

## One-time setup in Vercel (about 5 minutes)

1. **Create the storage**
   Open your project in Vercel → **Storage** tab → **Create Database** → choose **Blob** → name it
   `sp-builders-content` → if asked, choose **Public** access → **Create**. When asked, connect it to the
   `sp-builders-website` project for all environments. Vercel adds `BLOB_READ_WRITE_TOKEN` for you.

2. **Set your admin password**
   Project → **Settings** → **Environment Variables** → add `ADMIN_PASSWORD` with a long password
   (at least 8 characters, ideally 16+) for **Production**. Keep it private.

3. **Redeploy**
   Deployments → the top deployment → **⋯** → **Redeploy** (or just push a new commit).

4. **Log in**
   Go to `/admin`, enter the password. The first time, the editor shows the current website text.

## Using it

- **Projects**: Add project, Edit, the arrows change the order, the star shows a project on the home
  page (the first 3 starred ones), the bin deletes. Photos are resized automatically before upload.
- **Home page / Other pages / Contact details**: edit any text. Wrap words in `*stars*` to show them in
  the italic accent font, for example `Homes built by a civil engineer, *for over 25 years.*`
- **Save changes** publishes everything at once. Until you save, nothing on the website changes.
- **History** keeps every save. Load an older version, then Save to put it back.

## Notes

- The building animation at the top of the home page is not editable here, on purpose.
- Admin pages are hidden from Google.
- To try the admin page on your own computer: put `ADMIN_PASSWORD=anything-long` and `LOCAL_CONTENT=1`
  in `.env.local`, run `npm run dev`, and open http://127.0.0.1:3000/admin. Local edits are saved in
  the `.data` folder and do not affect the live site.
