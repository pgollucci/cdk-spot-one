# Welcome to `cdk-spot-one`

EC2 Spot Block with Single Instance and EIP

# Why you need it

Sometimes we need an Amazon EC2 instance with static fixed IP for testing or development purpose for a duration of
time(probably hours). We need to make sure during this time, no interruption will occur and we don't want to pay
for on-demand rate. `cdk-spot-one` helps you reserve one single spot instance with pre-allocated or new
Elastic IP addresses(EIP) with defined `blockDuration`, during which time the spot instance will be secured with no spot interruption.

Behind the scene, `cdk-spot-one` provisions a spot fleet with capacity of single instance for you and it associates the EIP with this instance. The spot fleet is reserved as spot block with `blockDuration` from one hour up to six hours to ensure the high availability for your spot instance.

Multiple spot instances are possible by simply specifying the `targetCapacity` construct property, but we only associate the EIP with the first spot instance at this moment.

Enjoy your highly durable one spot instance with AWS CDK!

# Sample

```ts
import { SpotFleet } from 'cdk-spot-one';

// create the first fleet for one hour and associate with our existing EIP
const fleet = new SpotFleet(stack, 'SpotFleet')

// configure the expiration after 1 hour
fleet.expireAfter(Duration.hours(1))

// create the 2nd fleet for 6 hours and associate with new EIP
const fleet2 = new SpotFleet(stack, 'SpotFleet2', {
  blockDuration: BlockDuration.SIX_HOURS,
  eipAllocationId: 'eipalloc-0d1bc6d85895a5410',
  vpc: fleet.vpc,
})
// configure the expiration after 6 hours
fleet2.expireAfter(Duration.hours(6))
```
