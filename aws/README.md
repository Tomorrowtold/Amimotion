# amimotion.com on AWS

Everything the website needs, in AmIMotion's own AWS account: the pages in a private S3 bucket, CloudFront in front
(HTTPS, speed, security headers), and one small Lambda for `/api/*` (Ask AmIMotion, the lead form, the founders' desk).
Same site, same agent code as the Vercel build. Expected cost at launch traffic: a few dollars a month, mostly CloudFront.

## You need
- AWS CLI v2 signed in to AmIMotion's account (`aws configure` or `aws sso login`) with admin rights for the first run.
- Python 3 and Node 22 (`brew install python node awscli` on a Mac).

## Three commands
```
DOMAIN=amimotion.com ./aws/cert.sh                       # 1. free certificate (adds proof records to Route 53 itself)
DOMAIN=amimotion.com CERT_ARN=<printed above> \
  GITHUB_REPO=amimotion/Amimotion ./aws/deploy.sh         # 2. builds and uploads everything, prints a test address
```
3. Open the test address (hidden from Google). When happy, point the domain: Route 53 › `amimotion.com` zone ›
   edit the `amimotion.com` A record and the `www.amimotion.com` A record › Alias to CloudFront › pick the
   address deploy.sh printed under "Point the domain at". Leave MX and TXT (Google email) alone.
   Rollback = set the two records back.

   The old site's CloudFront still claims `amimotion.com` and `www.amimotion.com`, and CloudFront lets only one
   distribution hold a name. So run step 2 first WITHOUT `DOMAIN`/`CERT_ARN` (test address only). At launch: remove
   the two names from the old distribution (CloudFront › old distribution › Edit › Alternate domain names), then
   run step 2 with them. Expect a few minutes where the old address shows an error; do it at a quiet hour.

## Updates
- By hand: run `./aws/deploy.sh` again with the same settings.
- Automatic: in GitHub › repository › Settings › Secrets and variables › Actions › Variables, add `AWS_ROLE_ARN`
  (printed by deploy.sh) and `AWS_REGION` (default `ap-south-1`). From then on every merge to `main` goes live by itself
  (`.github/workflows/aws-deploy.yml`). No AWS keys are stored in GitHub.

## Secrets (never in files or chat)
AWS console › Lambda › the `amimotion-website-ApiFunction…` function › Configuration › Environment variables.
`ALLOWED_ORIGINS` is set for you. Add as needed: `HUBSPOT_TOKEN` (leads into HubSpot, needed at launch),
`ANTHROPIC_API_KEY` (Claude for the guide; set a spend limit first), `DESK_TOKEN` (opens /desk/),
`LEAD_WEBHOOK`, `RESEND_API_KEY` + `LEAD_EMAIL_TO` + `LEAD_EMAIL_FROM`. The full list is at the top of `server/agent-server.js`.
Check with `/api/health/`, which shows which parts are switched on (names only).

## What is where
| File | What |
|---|---|
| `aws/template.yaml` | The whole AWS setup (CloudFormation): bucket, CloudFront, edge functions, Lambda, optional GitHub deploy role |
| `aws/deploy.sh` | Build, pack, create or update the stack, upload, clear the CDN cache |
| `aws/cert.sh` | The HTTPS certificate in us-east-1 |
| `aws/lambda/index.mjs` | Turns a Lambda request into the same call Vercel and Cloudflare make to `server/agent-server.js` |
