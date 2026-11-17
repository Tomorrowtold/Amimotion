#!/usr/bin/env bash
# Get the free HTTPS certificate for amimotion.com + www (CloudFront needs it in us-east-1).
# If the domain's DNS is in Route 53 in this AWS account, it also adds the proof records and waits until issued.
#   DOMAIN=amimotion.com ./aws/cert.sh      prints the certificate ARN for deploy.sh
set -euo pipefail
DOMAIN="${DOMAIN:?set DOMAIN, for example DOMAIN=amimotion.com}"
R=us-east-1
ARN=$(aws acm list-certificates --region $R --query "CertificateSummaryList[?DomainName=='$DOMAIN'].CertificateArn | [0]" --output text)
if [ "$ARN" = None ] || [ -z "$ARN" ]; then
  ARN=$(aws acm request-certificate --region $R --domain-name "$DOMAIN" --subject-alternative-names "www.$DOMAIN" --validation-method DNS --query CertificateArn --output text)
  echo "Requested certificate $ARN"; sleep 10
fi
ZONE=$(aws route53 list-hosted-zones-by-name --dns-name "$DOMAIN" --query "HostedZones[?Name=='$DOMAIN.'].Id | [0]" --output text | sed 's#/hostedzone/##')
RECS=$(aws acm describe-certificate --region $R --certificate-arn "$ARN" --query 'Certificate.DomainValidationOptions[].ResourceRecord' --output json)
if [ "$ZONE" != None ] && [ -n "$ZONE" ]; then
  CHANGES=$(echo "$RECS" | python3 -c 'import json,sys;r={x["Name"]:x for x in json.load(sys.stdin) if x};print(json.dumps({"Changes":[{"Action":"UPSERT","ResourceRecordSet":{"Name":x["Name"],"Type":x["Type"],"TTL":300,"ResourceRecords":[{"Value":x["Value"]}]}} for x in r.values()]}))')
  aws route53 change-resource-record-sets --hosted-zone-id "$ZONE" --change-batch "$CHANGES" >/dev/null
  echo "Added the proof records to Route 53. Waiting for AWS to issue the certificate (usually 2 to 10 minutes)..."
  aws acm wait certificate-validated --region $R --certificate-arn "$ARN"
  echo "Issued."
else
  echo "Route 53 has no zone for $DOMAIN in this account. Add these CNAME records wherever the DNS is, then run this again:"
  echo "$RECS" | python3 -c 'import json,sys;[print("  ",x["Name"],"CNAME",x["Value"]) for x in json.load(sys.stdin) if x]'
fi
echo "CERT_ARN=$ARN"
