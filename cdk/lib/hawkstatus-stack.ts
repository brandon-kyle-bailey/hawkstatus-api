import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import {
  CfnApplication,
  CfnApplicationVersion,
  CfnEnvironment,
} from 'aws-cdk-lib/aws-elasticbeanstalk';
import {
  CfnInstanceProfile,
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';

export interface EBEnvProps extends cdk.StackProps {
  // Autoscaling group configuration
  minSize?: string;
  maxSize?: string;
  instanceTypes?: string;
  envName?: string;
}

export class EBApplnStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: EBEnvProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // Construct an S3 asset Zip from directory up.
    const webAppZipArchive = new s3assets.Asset(this, 'WebAppZip', {
      path: `${__dirname}/../../src`,
    });

    // Create a ElasticBeanStalk app.
    const appName = 'Hawkstatus';
    const app = new CfnApplication(this, 'Application', {
      applicationName: appName,
    });

    // Create an app version from the S3 asset defined earlier
    const appVersionProps = new CfnApplicationVersion(this, 'AppVersion', {
      applicationName: appName,
      sourceBundle: {
        s3Bucket: webAppZipArchive.s3BucketName,
        s3Key: webAppZipArchive.s3ObjectKey,
      },
    });

    // Make sure that Elastic Beanstalk app exists before creating an app version
    appVersionProps.addDependency(app);

    // Create role and instance profile
    const myRole = new Role(this, `${appName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    const managedPolicy = ManagedPolicy.fromAwsManagedPolicyName(
      'AWSElasticBeanstalkWebTier',
    );
    myRole.addManagedPolicy(managedPolicy);

    const myProfileName = `${appName}-InstanceProfile`;

    const instanceProfile = new CfnInstanceProfile(this, myProfileName, {
      instanceProfileName: myProfileName,
      roles: [myRole.roleName],
    });

    // Example of some options which can be configured
    const optionSettingProperties: CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'IamInstanceProfile',
        value: myProfileName,
      },
      {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MinSize',
        value: props?.maxSize ?? '1',
      },
      {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MaxSize',
        value: props?.maxSize ?? '1',
      },
      {
        namespace: 'aws:ec2:instances',
        optionName: 'InstanceTypes',
        value: props?.instanceTypes ?? 't2.micro',
      },
    ];

    // Create an Elastic Beanstalk environment to run the application
    const elbEnv = new CfnEnvironment(this, 'Environment', {
      environmentName: props?.envName ?? 'MyWebAppEnvironment',
      applicationName: app.applicationName || appName,
      solutionStackName: '64bit Amazon Linux 2 v5.8.0 running Node.js 18',
      optionSettings: optionSettingProperties,
      versionLabel: appVersionProps.ref,
    });
  }
}
