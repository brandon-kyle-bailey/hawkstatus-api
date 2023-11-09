import { Construct } from 'constructs';
import { CfnOutput, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import {
  ApplicationListener,
  ApplicationLoadBalancer,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class ApplicationLoadBalancerComponent extends Construct {
  public readonly loadBalancerDnsName: string;
  listener: ApplicationListener;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id);

    const myVpc = Vpc.fromLookup(this, 'VPC', { isDefault: true });
    const alb = new ApplicationLoadBalancer(this, `ApplicationLoadBalancer`, {
      loadBalancerName: `simple-instance-1-alb`,
      vpc: myVpc,
      internetFacing: true,
    });

    this.loadBalancerDnsName = alb.loadBalancerDnsName;

    this.listener = alb.addListener(`alb-listener`, {
      port: 80,
      open: true,
    });

    new CfnOutput(this, `alb-dns-name`, {
      value: alb.loadBalancerDnsName,
    });
  }
}
