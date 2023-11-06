import * as cdk from '@aws-cdk/core';
import * as S3Assets from '@aws-cdk/aws-s3-assets';
import {
  CfnApplication,
  CfnApplicationVersion,
  CfnEnvironment,
} from 'aws-cdk-lib/aws-elasticbeanstalk';

export interface EbsStackProps extends cdk.StackProps {
  dbHost: string;
  dbPort: string;
  dbName: string;
}

export class EbsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: EbsStackProps) {
    super(scope, id, props);

    const username = props.dbCredentials.username.secretValue.toString();
    const password = props.dbCredentials.password.secretValue;

    // Here you can specify any other ENV variables which your application requires
    const environmentVariables: Record<string, any> = {
      POSTGRES_USER: username,
      POSTGRES_PASSWORD: password,
      POSTGRES_DB: props.dbName,
      DB_HOST: props.dbHost,
      DB_PORT: props.dbPort,
      DB_SCHEMA: username,
    };

    const environmentOptions = Object.keys(environmentVariables).map(
      (variable) => {
        return {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: variable,
          value: environmentVariables[variable],
        };
      },
    );

    const applicationName = 'Server';

    const assets = new S3Assets.Asset(this, `${applicationName}-assets`, {
      // Change path to your applications dist files
      // In my case I've created a monorepo, so path was like ../server/dist
      path: `${__dirname}/../../`,
      exclude: ['scripts', 'node_modules', 'cdk', 'dist', 'cdk.out'],
    });

    const application = new CfnApplication(this, `${applicationName}-app`, {
      applicationName,
    });

    const appVersionProps = new CfnApplicationVersion(
      this,
      `${applicationName}-version`,
      {
        applicationName,
        sourceBundle: {
          s3Bucket: assets.s3BucketName,
          s3Key: assets.s3ObjectKey,
        },
      },
    );

    const options: CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'IamInstanceProfile',
        value: 'aws-elasticbeanstalk-ec2-role',
      },
      {
        namespace: 'aws:ec2:instances',
        optionName: 'InstanceTypes',
        value: 't2.micro',
      },
    ];

    new CfnEnvironment(this, `${applicationName}-environment`, {
      environmentName: 'develop',
      applicationName: application.applicationName || applicationName,
      solutionStackName: '64bit Amazon Linux 2 v5.8.7 running Node.js 18',
      optionSettings: [...options, ...environmentOptions],
      versionLabel: appVersionProps.ref,
    });

    appVersionProps.addDependsOn(application);
  }
}
