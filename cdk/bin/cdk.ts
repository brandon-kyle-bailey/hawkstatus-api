#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EBApplnStack } from '../lib/hawkstatus-stack';

const app = new cdk.App();
new EBApplnStack(app, 'HawkstatusStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
