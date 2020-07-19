import { SpotFleet, InstanceInterruptionBehavior } from '../index';
import { App, Stack, Duration } from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import '@aws-cdk/assert/jest';
import { BlockDuration } from '../spot';

test('create the HTTP API', () => {
  const mockApp = new App();
  const stack = new Stack(mockApp, 'testing-stack');

  const fleet = new SpotFleet(stack, 'SpotFleet', {
    targetCapacity: 1,
    blockDuration: BlockDuration.SIX_HOURS,
    instanceInterruptionBehavior: InstanceInterruptionBehavior.HIBERNATE,
    defaultInstanceType: new ec2.InstanceType('t3.large'),
    eipAllocationId: 'eipalloc-0d1bc6d85895a5410',
    vpcSubnet: {
      subnetType: ec2.SubnetType.PUBLIC,
    },
    terminateInstancesWithExpiration: true,
  })
  // fleet to expire after 6 hours
  fleet.expireAfter(Duration.hours(6))
  expect(stack).toHaveResource('AWS::EC2::SpotFleet');
});



