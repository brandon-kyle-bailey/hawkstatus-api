import { Duration, RemovalPolicy, StackProps } from 'aws-cdk-lib';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
} from 'aws-cdk-lib/aws-rds';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
dotenv.config();

export class RdsComponent extends Construct {
  instance: DatabaseInstance;
  port: number;
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id);

    const engine = DatabaseInstanceEngine.postgres({
      version: PostgresEngineVersion.VER_12,
    });
    const instanceType = InstanceType.of(InstanceClass.T2, InstanceSize.MICRO);
    this.port = parseInt(process.env.DATABASE_PORT!, 10);
    const dbName = process.env.DATABASE_NAME!;

    // create database master user secret and store it in Secrets Manager
    const masterUserSecret = new Secret(this, 'db-master-user-secret', {
      secretName: 'db-master-user-secret',
      description: 'Database master user credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: process.env.DATABASE_USERNAME,
        }),
        generateStringKey: 'password',
        passwordLength: 16,
        excludePunctuation: true,
      },
    });

    // We know this VPC already exists
    const myVpc = Vpc.fromLookup(this, 'VPC', { isDefault: true });

    // Create a Security Group
    const dbSg = new SecurityGroup(this, 'Database-SG', {
      securityGroupName: 'Database-SG',
      vpc: myVpc,
    });

    // Add Inbound rule
    dbSg.addIngressRule(
      Peer.ipv4(myVpc.vpcCidrBlock),
      Port.tcp(this.port),
      `Allow port ${this.port} for database connection from only within the VPC (${myVpc.vpcId})`,
    );

    // create RDS instance (PostgreSQL)
    this.instance = new DatabaseInstance(this, 'DB-1', {
      vpc: myVpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      instanceType,
      engine,
      port: this.port,
      securityGroups: [dbSg],
      databaseName: dbName,
      credentials: Credentials.fromSecret(masterUserSecret),
      backupRetention: Duration.days(0), // disable automatic DB snapshot retention
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
