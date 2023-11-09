import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  Peer,
  Port,
  SecurityGroup,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

export interface Ec2ComponentProps extends StackProps {
  rdsPort: number;
}

export class Ec2Component extends Construct {
  instance: Instance;
  constructor(scope: Construct, id: string, props: Ec2ComponentProps) {
    super(scope, id);

    const defaultVpc = Vpc.fromLookup(this, 'VPC', { isDefault: true });

    const role = new Role(
      this,
      'simple-instance-1-role', // this is a unique id that will represent this resource in a Cloudformation template
      { assumedBy: new ServicePrincipal('ec2.amazonaws.com') },
    );

    // lets create a security group for our instance
    // A security group acts as a virtual firewall for your instance to control inbound and outbound traffic.
    const securityGroup = new SecurityGroup(this, 'simple-instance-1-sg', {
      vpc: defaultVpc,
      allowAllOutbound: true, // will let your instance send outboud traffic
      securityGroupName: 'simple-instance-1-sg',
    });

    // Add Inbound rule
    securityGroup.addEgressRule(
      Peer.ipv4(defaultVpc.vpcCidrBlock),
      Port.tcp(props.rdsPort),
      `Allow port ${props.rdsPort} for database connection from only within the VPC (${defaultVpc.vpcId})`,
    );

    // Add Inbound rule
    securityGroup.addEgressRule(
      Peer.anyIpv4(),
      Port.tcp(parseInt(process.env.SES_PORT!, 10)),
      `Allow port ${parseInt(
        process.env.SES_PORT!,
        10,
      )} for smtp connection from Internet`,
    );

    // lets use the security group to allow inbound traffic on specific ports
    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(22),
      'Allows SSH access from Internet',
    );

    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(80),
      'Allows HTTP access from Internet',
    );

    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(443),
      'Allows HTTPS access from Internet',
    );

    // Finally lets provision our ec2 instance
    this.instance = new Instance(this, 'simple-instance-1', {
      vpc: defaultVpc,
      role: role,
      securityGroup: securityGroup,
      instanceName: 'simple-instance-1',
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: MachineImage.latestAmazonLinux2023(),
      keyName: 'simple-instance-1-key', // we will create this in the console before we deploy
    });

    this.instance.addUserData(fs.readFileSync('scripts/user-data.sh', 'utf8'));
    // https://dev.to/emmanuelnk/part-4-wordpress-ec2-instance-in-asg-with-rds-database-and-alb-awesome-aws-cdk-3cij

    // cdk lets us output prperties of the resources we create after they are created
    // we want the ip address of this new instance so we can ssh into it later
    new CfnOutput(this, 'simple-instance-1-output', {
      value: this.instance.instancePublicIp,
    });
  }
}
