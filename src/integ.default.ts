import { SpotFleet } from './index';
import { VpcProvider, BlockDuration } from './spot';
import * as cdk from '@aws-cdk/core';
import { InstanceType } from '@aws-cdk/aws-ec2';

export class IntegTesting {
  readonly stack: cdk.Stack[];

  constructor() {

    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new cdk.Stack(app, 'SpotFleetStack5', { env });

    const vpc = VpcProvider.getOrCreate(stack);

    // create the first fleet for one hour and associate with our existing EIP
    const fleet = new SpotFleet(stack, 'SpotFleet', { vpc })

    // configure the expiration after 1 hour
    // fleet.expireAfter(cdk.Duration.hours(1))

    // create the 2nd fleet with single Gravition 2 instance for 6 hours and associate with EIP
    const fleet2 = new SpotFleet(stack, 'SpotFleet2', {
      blockDuration: BlockDuration.SIX_HOURS,
      eipAllocationId: 'eipalloc-0d1bc6d85895a5410',
      defaultInstanceType: new InstanceType('c6g.large'),
      vpc: fleet.vpc,
    })

    Array.isArray(fleet2)

    // configure the expiration after 6 hours
    // fleet2.expireAfter(cdk.Duration.hours(6))

    this.stack = [ stack ]
  }
}

// run the integ testing
new IntegTesting();








