# MarocVows self-hosted API

This folder is deployment source for the MarocVows PHP/MySQL API. GitHub Pages continues serving the public frontend.

## Recommended host layout

- Public website: https://www.marocvows.com/ (GitHub Pages)
- API subdomain: https://api.marocvows.com/
- API document root on cPanel: a dedicated folder such as `public_html/api.marocvows.com/`
- Private config: outside the web root, for example `/home/CPANEL_USER/marocvows-config.php`

## Deploy

1. In cPanel MySQL Databases, create a database and a dedicated database user.
2. Grant that user only the MarocVows database privileges required for these tables.
3. Import `schema.sql` in phpMyAdmin.
4. Copy `config.example.php` outside public_html, rename it to `marocvows-config.php`, and fill in the DB credentials.
5. Upload the contents of `public/` to the API subdomain document root.
6. If your private config is not three directories above the public scripts, set `MAROCVOWS_CONFIG_PATH` in the host environment or adjust only the bootstrap path after deployment.
7. Test newsletter POST with JSON:
   `{"email":"test@example.com","language":"fr","source":"homepage","consent":true}`
8. Do not expose phpMyAdmin, database passwords, or the private config in GitHub.

## Endpoints

- `POST /newsletter-subscribe.php`
- `POST /contact-event.php`

Both endpoints accept requests only from the MarocVows production origins configured in the private config.

## Privacy

The newsletter table stores the email, language, source, consent timestamp and status. It intentionally does not store IP addresses in the default implementation. Contact-event tracking stores provider/action/page context and no account identity.
