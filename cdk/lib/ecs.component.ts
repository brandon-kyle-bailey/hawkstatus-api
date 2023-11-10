import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import { StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

export interface EcsComponentProps extends StackProps {
  dbHost: string;
  dbPassword: string;
}

export class EcsComponent extends Construct {
  service: ecsp.ApplicationLoadBalancedFargateService;
  constructor(scope: Construct, id: string, props: EcsComponentProps) {
    super(scope, id);

    const defaultVpc = Vpc.fromLookup(this, 'VPC', { isDefault: true });

    this.service = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      'MyFargateService',
      {
        vpc: defaultVpc,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry(
            '004561463782.dkr.ecr.us-east-2.amazonaws.com/node-slim-nestjs-3000',
          ),
          containerPort: 3000,
          environment: {
            PORT: '3000',
            DATABASE_DRIVER: 'postgres',
            DATABASE_HOST: props.dbHost,
            DATABASE_PORT: '5432',
            DATABASE_NAME: 'hawkstatus',
            DATABASE_USERNAME: 'hawkstatus',
            DATABASE_PASSWORD: props.dbPassword,
            ACCESS_TOKEN_SECRET: 'hawkstatus',
            ACCESS_TOKEN_REFRESH: '30m',
            REFRESH_TOKEN_REFRESH: '365d',
            SMTP_HOST: 'localhost',
            SMTP_PORT: '1025',
            SMTP_USER: 'admin@hawkstatus.com',
            SMTP_PASSWORD: 'hawkstatus',
            SMTP_DEFAULT_FROM: '"Admin" <admin@hawkstatus.com>',
            SES_HOST: 'email-smtp.us-east-2.amazonaws.com',
            SES_PORT: '465',
            SES_USER: 'AKIAQCD7CNHTL2GF4MRH',
            SES_PASSWORD: 'BEci9hpn6M6QwDcgPXJXJp4bcC51oVb6UfT0p1j3o+JF',
          },
        },
        publicLoadBalancer: true,
      },
    );
  }
}
