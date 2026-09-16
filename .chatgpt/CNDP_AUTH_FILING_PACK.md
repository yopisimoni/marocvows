# MarocVows — CNDP & Auth Launch Filing Pack

Status: PREPARED — NOT FILED  
Project: MarocVows  
Production URL: https://www.marocvows.com/  
Controller/operator currently published on site: Simohamed Amara, Morocco  
Privacy contact: privacy@marocvows.com  
General contact: hello@marocvows.com

## 1. Launch rule

Do not enable `portalFeaturesEnabled` until:
1. the applicable CNDP declaration for the account/service processing has been filed and the required receipt/approval status is clear;
2. the foreign-transfer filing for Supabase hosting in France is filed/cleared as applicable;
3. production Auth redirect URLs are confirmed;
4. controlled passwordless login tests pass.

Keep `communityFeaturesEnabled:false` until the separate UGC/moderation/abuse-control gates pass.

## 2. CNDP forms identified

### Underlying processing
Use the CNDP normal declaration path (Form F211) unless CNDP directs this processing to another regime.

### Foreign transfer
Use Form F118 for transfer abroad. The CNDP states that a foreign-transfer authorization is granted only after the underlying processing has itself been declared/authorized.

## 3. Processing inventory for F211

### Purpose
Operate MarocVows accounts and authenticated marketplace support flows:
- create/sign in to an account;
- identify the account holder;
- allow a couple/family to submit a wedding-help request;
- allow a wedding professional to submit and manage a provider application;
- maintain account-linked request/application history;
- protect the service against misuse and maintain security.

Community reviews/photos/reports are NOT part of the initial account launch and stay disabled.

### Data subjects
- people planning a wedding or event;
- wedding/event professionals applying for a listing;
- authenticated MarocVows account holders.

### Data categories currently designed
Account/authentication:
- email address;
- phone number only when WhatsApp/phone OTP is enabled;
- Supabase authentication identifiers and session metadata;
- chosen role (client/provider).

Wedding-help request:
- name;
- account email;
- optional phone/WhatsApp;
- city;
- event date;
- approximate guest count;
- budget range;
- requested service categories;
- free-text notes.

Provider application:
- business/professional name;
- service category;
- contact name;
- account/business email;
- phone;
- optional WhatsApp;
- city;
- service area;
- optional business address;
- optional website;
- optional Instagram/social profile;
- service description.

Operational/security:
- request/session technical metadata as provided by the hosting/auth infrastructure.

### Data not intentionally requested
- passwords (the production model is passwordless);
- identity documents;
- payment card information;
- sensitive-category data;
- data about children as an account requirement.

## 4. Recipients / processors

### Active baseline
Supabase:
- authentication;
- PostgreSQL database;
- private application/request records;
- region: eu-west-3 (Paris, France).

### Optional providers — enable only after configuration and privacy/CNDP review
Google:
- OAuth identity provider when `oauthProviders` includes `google`.

Facebook/Meta:
- OAuth identity provider when `oauthProviders` includes `facebook`.

Twilio / Twilio Verify:
- phone/WhatsApp OTP delivery when `whatsappAuthEnabled:true`;
- requires an approved WhatsApp sender.

Do not list an optional provider as active until it is actually configured and enabled.

## 5. Foreign transfer for F118

Known foreign destination for the initial account service:
- France — Supabase project region eu-west-3 (Paris).

Information to attach/confirm:
- reference of the underlying CNDP declaration/authorization;
- relevant Supabase contractual/data-processing terms;
- privacy notice / collection notice shown to users;
- evidence of consent or other applicable legal basis where required;
- document authorizing the signatory, if applicable.

Additional countries/providers must be reassessed before enabling Google, Facebook or Twilio because their processing/subprocessors may introduce additional international data flows.

## 6. Data-subject information notice

Before collecting account data, the user-facing notice must clearly communicate:
- controller/operator identity;
- purpose(s) of collection;
- categories of information collected;
- recipients/processors, including foreign recipients where applicable;
- rights of access, rectification and objection under Moroccan law;
- privacy contact;
- CNDP declaration/authorization reference once received;
- foreign-transfer reference once received/applicable.

Never invent a CNDP receipt/reference number. Add it only after receipt.

## 7. Retention — decision still required

Do not invent retention periods in the filing. Confirm and document:
- inactive account retention;
- rejected provider-application retention;
- wedding-help request retention;
- security/auth-log retention;
- deletion/anonymization procedure.

Recommended implementation principle: retain only as long as needed for the stated purpose, legal obligations and security, then delete or anonymize.

## 8. Security controls already present

- Supabase Row Level Security enabled on public data tables.
- User-owned request/application policies restrict rows by authenticated user ID.
- Public community features remain disabled.
- Public frontend uses only the Supabase publishable key; no service-role secret is exposed.
- Auth providers remain hidden unless explicitly enabled in configuration.
- Provider/contact application data is not auto-published.
- Production HTTPS/canonical domain is in place.

## 9. Auth launch configuration

Current public flags:
```text
portalFeaturesEnabled: false
communityFeaturesEnabled: false
oauthProviders: []
whatsappAuthEnabled: false
```

Planned methods:
1. Email magic link — baseline.
2. Google OAuth — enable only after Google OAuth client + Supabase provider configuration/test.
3. Facebook OAuth — enable only after Meta app + Supabase provider configuration/test.
4. WhatsApp OTP — enable only after Supabase phone auth + Twilio/Twilio Verify + approved WhatsApp sender are configured/tested.

## 10. Controlled activation sequence

1. File/clear F211 or the CNDP-directed equivalent.
2. File/clear F118 for France/Supabase.
3. Add the CNDP reference(s) to Privacy/collection notices.
4. Test email magic-link signup/sign-in on desktop.
5. Test email flow on mobile.
6. Configure one social provider at a time; test before adding it to `oauthProviders`.
7. Configure Twilio/Twilio Verify; test WhatsApp OTP before setting `whatsappAuthEnabled:true`.
8. Set `portalFeaturesEnabled:true`.
9. Keep `communityFeaturesEnabled:false`.
10. Re-run live/mobile QA and update the master sheet.

## 11. User-owned information still needed for the filings

These fields cannot be safely guessed:
- controller's complete postal address used for the CNDP filing;
- legal/entity status under which MarocVows is operated;
- signatory authority/supporting document where applicable;
- final retention periods;
- any additional processors/subprocessors declared in the filing;
- final CNDP receipt/authorization numbers.

## 12. Official references

- CNDP — notification/declaration procedures: https://www.cndp.ma/notifier-un-traitement/
- CNDP — procedures and forms: https://www.cndp.ma/procedures-de-notification-process/
- CNDP — foreign transfer: https://www.cndp.ma/transfert-de-donnees-a-letranger/
- CNDP — model information notices: https://www.cndp.ma/mentions-types/
- Supabase — Google social login: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase — Facebook social login: https://supabase.com/docs/guides/auth/social-login/auth-facebook
- Supabase — phone/WhatsApp login: https://supabase.com/docs/guides/auth/phone-login
- Twilio Verify WhatsApp: https://www.twilio.com/docs/verify/whatsapp
