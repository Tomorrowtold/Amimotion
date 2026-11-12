#!/usr/bin/env bash
# Put amimotion.com on AWS in one command. Needs: AWS CLI v2 signed in (aws configure or aws sso login), Python 3, Node 22.
#
#   ./aws/deploy.sh                                   first run: makes everything, prints a test address
#   DOMAIN=amimotion.com CERT_ARN=arn:... ./aws/deploy.sh   after the certificate is issued: adds the real domain
#   GITHUB_REPO=amimotion/Amimotion ./aws/deploy.sh   optional: lets every push to main deploy itself
#   Keep DOMAIN, CERT_ARN and GITHUB_REPO set on every later full run, or the stack drops them again.
#
# Every later run uploads the latest site and API. Safe to run again at any time.
set -euo pipefail
cd "$(dirname "$0")/.."
STACK="${STACK:-amimotion-website}"
REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-ap-south-1}}"   # Mumbai by default (closest to Indian visitors)
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
CODE_BUCKET="${CODE_BUCKET:-amimotion-website-code-$ACCOUNT-$REGION}"
STAMP=$(date -u +%Y%m%d%H%M%S)
WORK="${TMPDIR:-/tmp}/amimotion-aws"; rm -rf "$WORK"; mkdir -p "$WORK/lambda"
echo "1/5 Building the site"
bash vercel-build.sh >/dev/null

echo "2/5 Packing the API"
cp aws/lambda/index.mjs "$WORK/lambda/"
mkdir -p "$WORK/lambda/server" "$WORK/lambda/site/src/js" "$WORK/lambda/site/assets/agent"
cp server/agent-server.js "$WORK/lambda/server/"
cp site/src/js/agent-core.js "$WORK/lambda/site/src/js/"
cp studio/out/assets/agent/kb.json "$WORK/lambda/site/assets/agent/"
node -e 'const p=require("./package.json");require("fs").writeFileSync(process.argv[1],JSON.stringify({name:"amimotion-api",private:true,type:"module",dependencies:p.dependencies},null,1))' "$WORK/lambda/package.json"
(cd "$WORK/lambda" && npm install --omit=dev --no-audit --no-fund --silent && zip -qr "$WORK/api.zip" .)
KEY="api/$STAMP.zip"

echo "3/5 Uploading the API to $REGION"
aws s3api head-bucket --bucket "$CODE_BUCKET" --region "$REGION" 2>/dev/null || {
  if [ "$REGION" = us-east-1 ]; then aws s3api create-bucket --bucket "$CODE_BUCKET" --region "$REGION" >/dev/null
  else aws s3api create-bucket --bucket "$CODE_BUCKET" --region "$REGION" --create-bucket-configuration LocationConstraint="$REGION" >/dev/null; fi
  aws s3api put-public-access-block --bucket "$CODE_BUCKET" --region "$REGION" --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
}
aws s3 cp "$WORK/api.zip" "s3://$CODE_BUCKET/$KEY" --region "$REGION" --only-show-errors

echo "4/5 Creating or updating the AWS stack '$STACK' (the first time takes about 5 minutes)"
if [ -z "${UPDATE_ONLY:-}" ]; then   # GitHub Actions sets UPDATE_ONLY=1: it may upload, not change the stack
OIDC=no
if [ -n "${GITHUB_REPO:-}" ] && ! aws iam list-open-id-connect-providers --output text | grep -q token.actions.githubusercontent.com; then OIDC=yes; fi
aws cloudformation deploy --region "$REGION" --stack-name "$STACK" --template-file aws/template.yaml \
  --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset \
  --parameter-overrides DomainName="${DOMAIN:-}" CertificateArn="${CERT_ARN:-}" \
    LambdaCodeBucket="$CODE_BUCKET" LambdaCodeKey="$KEY" GitHubRepo="${GITHUB_REPO:-}" CreateGitHubOidcProvider="$OIDC"
fi
out() { aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text; }
BUCKET=$(out SiteBucket); FN=$(out ApiFunction); DIST=$(out DistributionId)
# a stack that did not change keeps its old code key, so push the new API code directly too
aws lambda update-function-code --region "$REGION" --function-name "$FN" --s3-bucket "$CODE_BUCKET" --s3-key "$KEY" >/dev/null

echo "5/5 Uploading the pages"
S=studio/out
# pictures, fonts and video: cache for a day; everything else (pages, scripts, styles, data): always check for a newer copy
aws s3 sync "$S" "s3://$BUCKET" --delete --only-show-errors --exclude '*' \
  --include '*.avif' --include '*.webp' --include '*.jpg' --include '*.jpeg' --include '*.png' --include '*.svg' --include '*.gif' --include '*.ico' \
  --include '*.mp4' --include '*.webm' --include '*.woff2' --include '*.woff' --include '*.mesh' --include '*.bin' --include '*.glb' --include '*.ktx2' --include '*.wasm' \
  --cache-control 'public, max-age=86400, stale-while-revalidate=604800'
aws s3 sync "$S" "s3://$BUCKET" --delete --only-show-errors \
  --exclude '*.avif' --exclude '*.webp' --exclude '*.jpg' --exclude '*.jpeg' --exclude '*.png' --exclude '*.svg' --exclude '*.gif' --exclude '*.ico' \
  --exclude '*.mp4' --exclude '*.webm' --exclude '*.woff2' --exclude '*.woff' --exclude '*.mesh' --exclude '*.bin' --exclude '*.glb' --exclude '*.ktx2' --exclude '*.wasm' \
  --exclude '_headers' --cache-control 'public, max-age=0, must-revalidate'
aws cloudfront create-invalidation --distribution-id "$DIST" --paths '/*' --query Invalidation.Id --output text >/dev/null

echo
echo "Done."
echo "  Test address:  $(out TestAddress)   (hidden from Google)"
[ -n "${DOMAIN:-}" ] && echo "  Live address:  https://www.$DOMAIN"
echo "  Point the domain at: $(out DnsTarget)"
echo "  Health check:  $(out TestAddress)/api/health/"
if [ -n "${GITHUB_REPO:-}" ]; then echo "  GitHub role:   $(out GitHubDeployRoleArn)   (save as repository variable AWS_ROLE_ARN, plus AWS_REGION=$REGION)"; fi
