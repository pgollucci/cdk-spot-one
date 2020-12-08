import { InstanceType } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { SpotFleet } from './index';
import { VpcProvider, BlockDuration } from './spot';

export class IntegTesting {
  readonly stack: cdk.Stack[];

  constructor() {

    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new cdk.Stack(app, 'SpotFleetStack', { env });

    const instanceType = stack.node.tryGetContext('instance_type') || 't3.large';
    const eipAllocationId = stack.node.tryGetContext('eip_allocation_id');
    const volumeSize = stack.node.tryGetContext('volume_size') || 60;

    const vpc = VpcProvider.getOrCreate(stack);

    const fleet = new SpotFleet(stack, 'SpotFleet', { 
      vpc,
      blockDuration: BlockDuration.SIX_HOURS,
      eipAllocationId: eipAllocationId,
      defaultInstanceType: new InstanceType(instanceType),
      blockDeviceMappings: [
        {
          deviceName: '/dev/xvda',
          ebs: {
            volumeSize,
          },
        },
      ],
    });

    const expireAfter = stack.node.tryGetContext('expire_after')
    if (expireAfter){
      fleet.expireAfter(cdk.Duration.hours(expireAfter))
    }

    this.stack = [stack];
  }
}

// run the integ testing
new IntegTesting();


