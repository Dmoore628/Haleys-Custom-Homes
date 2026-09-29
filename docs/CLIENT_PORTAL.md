# Client portal

`/client-portal` is the clients' way into their project portal. It is deliberately just that: one
screen with a button that hands the client to the portal's own secure sign-in. Nobody types a
password on this site, so the site never handles client credentials.

The old site's address, `/client-login`, redirects here permanently, so bookmarks keep working.

## Today: Buildertrend

Haley's clients use **Buildertrend**. The old site embedded Buildertrend's login frame for
builder ID **85** (`buildertrend.net/BuilderWebsiteLoginFrame.aspx?builderID=85`). That frame now
redirects to `https://buildertrend.net/app/login/frame?builderID=85`, which is only a
"Sign in to Buildertrend" button opening Buildertrend's standard sign-in
(`https://buildertrend.net/app/Login`, then `login.buildertrend.com`). Browsers block signing in
inside embedded frames, so the new page links to the sign-in directly instead of embedding it.

## Changing it

Everything is in `content/site.config.ts`, under `clientPortal`:

```ts
clientPortal: {
  provider: 'Buildertrend',                        // named under the button
  signInUrl: 'https://buildertrend.net/app/Login', // where the button goes
  builderId: 85,                                   // for reference
},
```

- **New provider** (CoConstruct, JobTread, Procore, Houzz Pro, ...): set `provider` to its name and
  `signInUrl` to its client sign-in page, then redeploy.
- **Portal not ready**: set `signInUrl: null`. The page then says the portal is being connected
  and offers Haley's phone and email instead.
- **Branded sign-in**: if the provider offers a Haley-branded sign-in address (some do, for
  example a custom subdomain), use that as `signInUrl`.

The page is excluded from search engines (`noindex`) and linked from the site footer.
