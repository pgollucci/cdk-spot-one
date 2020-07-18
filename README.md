
[![NPM version](https://badge.fury.io/js/cdk-spot-one.svg)](https://badge.fury.io/js/cdk-spot-one)
[![PyPI version](https://badge.fury.io/py/cdk-spot-one.svg)](https://badge.fury.io/py/cdk-spot-one)
![Release](https://github.com/pahud/cdk-spot-one/workflows/Release/badge.svg)

# Welcome to `cdk-spot-one`

EC2 Spot Block with Single Instance and EIP

# Sample

Create a single EC2 spot instance for 6 hours with EIP attached:

```ts
import { SpotFleet } from 'cdk-spot-one';

const fleet = new SpotFleet(stack, 'SpotFleet', {
  targetCapacity: 1,
  instanceInterruptionBehavior: InstanceInterruptionBehavior.HIBERNATE,
  defaultInstanceType: new ec2.InstanceType('c5.large'),
  eipAllocationId: 'eipalloc-0d1bc6d85895a5410',
  vpcSubnet: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  terminateInstancesWithExpiration: true,
})

// fleet to expire after 6 hours
fleet.expireAfter(Duration.hours(6))
```
