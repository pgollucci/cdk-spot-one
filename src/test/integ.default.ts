import { SpotFleet } from '../index';
import { App, Stack, Duration } from '@aws-cdk/core';
import { VpcProvider, BlockDuration } from '../spot';
import { InstanceType } from '@aws-cdk/aws-ec2';

const app = new App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new Stack(app, 'SpotFleetStack5', { env });

const vpc = VpcProvider.getOrCreate(stack);

// create the first fleet for one hour and associate with our existing EIP
const fleet = new SpotFleet(stack, 'SpotFleet', { vpc })

// configure the expiration after 1 hour
fleet.expireAfter(Duration.hours(1))

// create the 2nd fleet with single Gravition 2 instance for 6 hours and associate with new EIP
const fleet2 = new SpotFleet(stack, 'SpotFleet2', {
  blockDuration: BlockDuration.SIX_HOURS,
  eipAllocationId: 'eipalloc-0d1bc6d85895a5410',
  defaultInstanceType: new InstanceType('c6g.large'),
  vpc: fleet.vpc,
})

// configure the expiration after 6 hours
fleet2.expireAfter(Duration.hours(6))







