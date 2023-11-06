import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as dotenv from 'dotenv';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
dotenv.config();

export interface RdsStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class RdsStack extends cdk.Stack {
  readonly postgreSQLinstance: rds.DatabaseInstance;

  constructor(scope: cdk.Construct, id: string, props: RdsStackProps) {
    super(scope, id, props);

    const secretPassword = new secretsmanager.Secret(this, 'Secret', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      generateSecretString: {
        generateStringKey: 'password',
      },
    });

    this.postgreSQLinstance = new rds.DatabaseInstance(this, 'Postgres', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_12_4,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      vpc: props.vpc,
      vpcPlacement: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      storageType: rds.StorageType.GP2,
      deletionProtection: false,
      databaseName: process.env.DATABASE_NAME,
      port: 5432,
      credentials: {
        username: process.env.DATABASE_USERNAME!,
        password: secretPassword.secretValue,
      },
    });

    this.postgreSQLinstance.connections.allowDefaultPortInternally();
  }
}
