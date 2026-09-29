# Enable email and WhatsApp enquiries

The code is ready, but no sending accounts or credentials are connected. Do not claim live delivery until the final test below passes.

Destinations are fixed in server code: spbuilders2003@gmail.com and whatsapp:+919841145873. Visitors cannot change recipients. Both receive the name, email, phone, project type and message. The form permits 500 message characters so the entire enquiry fits the approved WhatsApp template; whitespace is normalised for WhatsApp.

## 1. Email: Resend

Create an account at https://resend.com and verify a domain you own by adding the DNS records Resend supplies. The Gmail address is the recipient, not the verified sender. Create a sending API key and put it into RESEND_API_KEY locally. Set ENQUIRY_FROM_EMAIL to `SP Builders <enquiries@your-verified-domain>` using your actual domain. For an initial restricted test, follow Resend's account-specific onboarding instructions. Production requires a verified sender.

Official reference: https://resend.com/docs/api-reference/emails/send-email

## 2. WhatsApp: Twilio

Create an account at https://www.twilio.com and use its WhatsApp onboarding to register an eligible business sender. The API sender must be different from the receiving number +919841145873. Do not migrate the owner's current receiving number just to enable these notifications. Complete any business verification and provider requirements. Review pricing before purchasing a sender or activating paid service.

For an initial test, Twilio's WhatsApp Sandbox requires the receiving phone to join using the instructions shown in your account; it is not a permanent production connection. Production business-initiated notifications require an approved template. Obtain recipient opt-in for these enquiry notifications.

In Content Template Builder submit this template, supplying realistic example values for all five variables. Approval is determined by WhatsApp; wording may need adjustment while preserving variable order:

```
New SP Builders website enquiry.
Name: {{1}}
Email: {{2}}
Phone: {{3}}
Project: {{4}}
Message: {{5}}
Please contact the visitor to discuss their enquiry.
```

Copy its approved HX Content SID to TWILIO_CONTENT_SID. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_WHATSAPP_FROM (format `whatsapp:+<approved sender number>`). Keep credentials out of chat and source control.

Official reference: https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates

## 3. Storage and configuration

Create a Supabase project and run `supabase/schema.sql` in its SQL editor. This also adds notification audit columns to an existing table. Copy the project URL and server service-role key into the matching environment fields. Generate a random secret of at least 32 characters for CONTACT_RATE_LIMIT_SECRET. The existing rate limiter assumes Vercel's trusted forwarding header; review the trusted IP source when deploying to a different host. Local requests share a single five-per-hour bucket.

Copy `.env.example` to `.env.local` and fill the fields privately in VS Code. Do not overwrite an existing environment file. Restart the local server after changing credentials. Configure the same server-only values in your eventual hosting environment. Nothing is deployed by this setup.

## 4. Verify before launch

Submit one clearly labelled test enquiry with your own contact details after all services are configured. Confirm both inboxes receive it. In Supabase, verify both provider IDs and accepted statuses. Provider acceptance is not proof of final delivery: check the Resend and Twilio dashboards for bounces or delivery failures.

If a provider fails, the enquiry remains saved and the visitor is told that both notifications could not be confirmed. Status `unknown` means a timeout or unconfirmed response; inspect provider logs before attempting a manual resend to avoid duplicates. There is currently no scheduled retry worker or delivery receipt webhook. Inspect pending/failed/unknown records operationally; never delete them as part of a retry.

Local automated tests mock providers and send no messages. Real account setup, template approval and end-to-end delivery remain required.
