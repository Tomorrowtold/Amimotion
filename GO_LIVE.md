# amimotion.com: everything AmIMotion gets, and how to put it live

The new site goes live in AmIMotion's own AWS account, next to the domain. Nothing depends on anyone else's hosting. One command builds it, and after that every approved change goes live by itself.

## What is in this repository

| Item | What it is |
|---|---|
| `aws/` | The AWS kit: one CloudFormation stack, `deploy.sh`, `cert.sh`, the edge rules and their test. Details in `aws/README.md`. |
| `site/`, `studio/` | The pages and the homepage. `bash vercel-build.sh` builds the finished site into `studio/out/` (867 files). |
| `server/` | The one small server: Ask AmIMotion, the lead form, the lead desk, the health check. |
| `.github/workflows/` | Checks on every change, and the automatic AWS deploy once it is switched on. |

## Where things live today

| Thing | Where | Owner |
|---|---|---|
| Domain amimotion.com | Registered at **GoDaddy** (renews Oct 2028). DNS is in **Amazon Route 53**. | AmIMotion |
| Old site | S3 + CloudFront in AmIMotion's AWS, the same account as the DNS | AmIMotion |
| Company email | Google Workspace (MX and SPF records). **Never touch these.** | AmIMotion |

## Before you start

1. A laptop with **AWS CLI v2, Python 3 and Node 22**. On a Mac: `brew install awscli python node`.
2. **AWS admin sign-in** for the account that holds Route 53 `amimotion.com`. Run `aws configure` (or `aws sso login`) once and check with `aws sts get-caller-identity`.
3. A **GitHub organisation** called `amimotion` (free), with `Tomorrowtold` invited as an owner, so the code can move to you.
4. A **HubSpot private app token** with contacts and notes write access, if leads should land in HubSpot. Keep it to yourself; you type it in at step 6. Without it the lead form opens an email to sales@amimotion.com instead, so no lead is lost.
5. Choose a quiet hour for step 4. The old address shows an error for a few minutes while the names move.

## Go live (about 45 minutes)

**1. Get the code (3 min).** The owner of `Tomorrowtold/Amimotion` opens Settings › Transfer › owner `amimotion`, and AmIMotion accepts. Then `git clone https://github.com/amimotion/Amimotion && cd Amimotion && npm install`.

**2. Certificate (5 min, mostly waiting).** `DOMAIN=amimotion.com ./aws/cert.sh`. It requests the free HTTPS certificate, adds the proof records to Route 53 itself, waits until the certificate is issued and prints `CERT_ARN=...`. Keep that line.

**3. Build everything on a test address first (8 min).** `GITHUB_REPO=amimotion/Amimotion ./aws/deploy.sh`. It builds the site, checks it, creates the storage, CloudFront and the small server in Mumbai, and prints a test address that is hidden from Google. Open it and check the homepage, one product page, one guide, Book a call, and `/api/health/`. **Nothing about the live domain has changed yet.** If anything looks wrong here, stop; the old site is untouched.

**4. Free the names from the old site (2 min).** CloudFront lets only one distribution hold a name. AWS console › CloudFront › the old site's distribution › Edit › remove `amimotion.com` and `www.amimotion.com` › Save, and wait until it shows Deployed.

**5. Put the new site on the domain (8 min).**
- Run `DOMAIN=amimotion.com CERT_ARN=<from step 2> GITHUB_REPO=amimotion/Amimotion ./aws/deploy.sh`
- Route 53 › `amimotion.com`. **Take a screenshot of the record list first; that is the undo.** Edit the `amimotion.com` A record and the `www.amimotion.com` A record: Alias › CloudFront › the address printed as "Point the domain at". Do not touch MX, TXT or NS.
- Open https://www.amimotion.com in a private window. Then open https://amimotion.com and check it jumps to www.

**6. Switch on leads (3 min).** AWS › Lambda › `amimotion-website-ApiFunction…` › Configuration › Environment variables › add `HUBSPOT_TOKEN`. You type it yourself; it never goes in chat or email. `/api/health/` should then show `"hubspot": true`. Send one test lead from Book a call and find it in HubSpot.

**7. Make updates automatic (3 min).** GitHub › `amimotion/Amimotion` › Settings › Secrets and variables › Actions › Variables › add `AWS_ROLE_ARN` (printed in step 5) and `AWS_REGION` = `ap-south-1`. From now on every change merged to `main` goes live in a few minutes. No AWS keys are stored in GitHub.

**8. Tell Google (5 min).** Search Console › add the Domain property `amimotion.com` › add its TXT record in Route 53 (keep the SPF record) › submit `https://www.amimotion.com/sitemap.xml`. Then Bing Webmaster Tools › Import from Search Console.

## Checks right after

| Check | Expected |
|---|---|
| Homepage, a product page, a guide, Book a call | Load and look like the test address |
| An old address, such as amimotion.com/booking | Jumps to the right new page |
| /sitemap.xml and /robots.txt | Open, and name www.amimotion.com |
| Email to and from an amimotion.com address | Still works |
| Page source of the homepage | No "noindex" |

## Undo

Set the two Route 53 records back to the screenshot, and add the two names back on the old distribution. The old site is back within minutes. Keep the old bucket and distribution for two weeks.

## Still to decide

| What | Who |
|---|---|
| Analytics: none, Plausible (no cookies), or the Google Analytics property the old site used (needs a consent banner). One line in `site/src/js/config.js` switches it on. | Founders |
| An uptime check on the homepage and the lead form | Founders |
| Terms page text, Sumeer's title, bios, and the first results for the Proof page | Founders |
| Optional: `ANTHROPIC_API_KEY` in the Lambda settings so Ask AmIMotion answers with Claude. Set a monthly spend limit first. Without it, Ask answers from the site's own pages. | Founders |

## Honest notes

- The AWS kit passes its template check and its own tests, and its edge rules are tested against every redirect. **It has not yet run in a real AWS account.** Step 3 is the dry run, and it changes nothing live.
- The site was tested in Chromium on laptop and phone sizes. Give it one look in Safari and on an iPhone on the test address.
- The homepage explainer section is still being revised. Running `./aws/deploy.sh` again, or merging to `main` once step 7 is done, puts any later version live.
