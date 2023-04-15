#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SubdomainApiStack } from '../lib/subdomain-api-stack';
import { config } from '../config';

const app = new cdk.App();
new SubdomainApiStack(app, 'SubdomainApiStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },  
  apiName: config.apiName,
  apiDomainName: config.apiDomainName,
  hostedZoneId: config.hostedZoneId,
  zoneName: config.zoneName,
  recordName: config.recordName,
  certificateArn: config.certificateArn
});