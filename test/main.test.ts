import { App, Stack } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { SpotFleet } from '../src';

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

test('default cluster provision single ec2 instance', () => {
  const app = new App();
  const stack = new Stack(app, 'testing', { env: devEnv });
  new SpotFleet(stack, 'SpotFleet');
  expect(stack).toHaveResourceLike('AWS::EC2::SpotFleet', {
    SpotFleetRequestConfigData: {
      TargetCapacity: 1,
    },
  });
});

test('fleet with custom AMI ID comes with default linux userdata', () => {
  const app = new App();
  const stack = new Stack(app, 'testing', { env: devEnv });
  new SpotFleet(stack, 'SpotFleet', {
    customAmiId: 'ami-xxxxxx',
  });
  expect(stack).toHaveResourceLike('AWS::EC2::LaunchTemplate', {
    LaunchTemplateData: {
      UserData: {
        'Fn::Base64': '#!/bin/bash',
      },
    },
  });
});