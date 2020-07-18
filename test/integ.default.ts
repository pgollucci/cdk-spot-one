import { SpotFleet, InstanceInterruptionBehavior } from '../src/index';
import * as ec2 from '@aws-cdk/aws-ec2';
import { App, Stack, Duration } from '@aws-cdk/core';

const app = new App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new Stack(app, 'SpotFleetStack', { env });

const fleet = new SpotFleet(stack, 'SpotFleet', {
  targetCapacity: 1,
  instanceInterruptionBehavior: InstanceInterruptionBehavior.HIBERNATE,
  defaultInstanceType: new ec2.InstanceType('t3.large'),
  eipAllocationId: 'eipalloc-0d1bc6d85895a5410',
  vpcSubnet: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  terminateInstancesWithExpiration: true,
})

// allocate this fleet for 6 hours
fleet.expireAfter(Duration.hours(6))







