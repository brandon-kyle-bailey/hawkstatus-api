import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RdsComponent } from './rds.component';
import { Ec2Component } from './ec2.component';
import { ApplicationLoadBalancerComponent } from './alb.component';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // const alb = new ApplicationLoadBalancerComponent(
    //   this,
    //   'AlbComponent',
    //   props,
    // );
    const rds = new RdsComponent(this, 'RdsComponent', props);
    const ec2 = new Ec2Component(this, 'Ec2Component', {
      ...props,
      rdsPort: rds.port,
    });
  }
}
