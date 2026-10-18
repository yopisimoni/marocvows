# Private vendor dashboard (restricted pilot)

A zero-dependency Python web UI for the existing MarocVows candidate SQLite database.

## Security model
- Hard-coded to **127.0.0.1:8767**, never a public interface.
- Requires HTTP Basic authentication with username `admin` and a random token in `~/marocvows-private/admin-token` (mode 0600).
- SSH authentication is required before accessing it via local forwarding.
- Denies unauthenticated requests (401), denies cross-origin review POSTs, sets no-cache, CSP, frame restrictions.
- Displays only commercial candidate fields from the private database; no customer information is served.
- Updating a status records an audit entry and **never publishes** to the public site.
- This is a proof-of-concept. **Do not expose this service to the internet or behind a public reverse proxy.**

## Operator access

From an already authorized SSH device:

```sh
ssh -N -L 8767:127.0.0.1:8767 deploy@37.60.247.242
```

Open `http://localhost:8767/` locally. Browser authentication username: `admin`. Obtain the token through an authenticated SSH shell **without pasting it into a chat or storing it in source control**:

```sh
ssh -t deploy@37.60.247.242 'cat ~/marocvows-private/admin-token'
```

Keep your SSH terminal open while reviewing. Stop or disable the server when the pilot is not in use.

## Production follow-up
- Add systemd user service with restart and structured monitoring only after testing.
- Conduct complete authorized GET/POST, unauthorized and cross-origin integration tests; assess CSRF, brute-force throttling, back-up, and concurrency under production conditions.
- Consider managed admin authentication and stronger session controls for persistent operation.
- Review OSM license compliance and privacy obligations before launching wedding-help accounts or public listings.
