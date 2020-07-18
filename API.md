# API Reference

**Classes**

Name|Description
----|-----------
[LaunchTemplate](#cdk-spot-one-launchtemplate)|*No description*
[SpotFleet](#cdk-spot-one-spotfleet)|*No description*
[VpcProvider](#cdk-spot-one-vpcprovider)|*No description*


**Structs**

Name|Description
----|-----------
[BaseSpotFleetProps](#cdk-spot-one-basespotfleetprops)|*No description*
[SpotFleetLaunchTemplateConfig](#cdk-spot-one-spotfleetlaunchtemplateconfig)|*No description*
[SpotFleetProps](#cdk-spot-one-spotfleetprops)|*No description*


**Interfaces**

Name|Description
----|-----------
[ILaunchtemplate](#cdk-spot-one-ilaunchtemplate)|*No description*


**Enums**

Name|Description
----|-----------
[BlockDuration](#cdk-spot-one-blockduration)|*No description*
[InstanceInterruptionBehavior](#cdk-spot-one-instanceinterruptionbehavior)|*No description*



## class LaunchTemplate 🔹 <a id="cdk-spot-one-launchtemplate"></a>



__Implements__: [ILaunchtemplate](#cdk-spot-one-ilaunchtemplate)

### Initializer




```ts
new LaunchTemplate()
```



### Methods


#### bind(spotfleet)🔹 <a id="cdk-spot-one-launchtemplate-bind"></a>



```ts
bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig
```

* **spotfleet** (<code>[SpotFleet](#cdk-spot-one-spotfleet)</code>)  *No description*

__Returns__:
* <code>[SpotFleetLaunchTemplateConfig](#cdk-spot-one-spotfleetlaunchtemplateconfig)</code>



## class SpotFleet 🔹 <a id="cdk-spot-one-spotfleet"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IResource](#aws-cdk-core-iresource), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IConstruct](#aws-cdk-core-iconstruct)
__Extends__: [Resource](#aws-cdk-core-resource)

### Initializer




```ts
new SpotFleet(scope: Construct, id: string, props: SpotFleetProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SpotFleetProps](#cdk-spot-one-spotfleetprops)</code>)  *No description*
  * **physicalName** (<code>string</code>)  The value passed in by users to the physical name prop of the resource. __*Default*__: The physical name will be allocated by CloudFormation at deployment time
  * **blockDuration** (<code>[BlockDuration](#cdk-spot-one-blockduration)</code>)  *No description* __*Optional*__
  * **bootstrapEnabled** (<code>boolean</code>)  *No description* __*Optional*__
  * **customAmiId** (<code>string</code>)  *No description* __*Optional*__
  * **defaultInstanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  *No description* __*Optional*__
  * **instanceInterruptionBehavior** (<code>[InstanceInterruptionBehavior](#cdk-spot-one-instanceinterruptionbehavior)</code>)  *No description* __*Optional*__
  * **instanceRole** (<code>[Role](#aws-cdk-aws-iam-role)</code>)  *No description* __*Optional*__
  * **mapRole** (<code>boolean</code>)  *No description* __*Optional*__
  * **targetCapacity** (<code>number</code>)  *No description* __*Optional*__
  * **terminateInstancesWithExpiration** (<code>boolean</code>)  *No description* __*Optional*__
  * **validFrom** (<code>string</code>)  *No description* __*Optional*__
  * **validUntil** (<code>string</code>)  *No description* __*Optional*__
  * **vpcSubnet** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  *No description* __*Optional*__
  * **eipAllocationId** (<code>string</code>)  *No description* __*Optional*__
  * **launchTemplate** (<code>[ILaunchtemplate](#cdk-spot-one-ilaunchtemplate)</code>)  *No description* __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**defaultInstanceType**🔹 | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | <span></span>
**instanceRole**🔹 | <code>[IRole](#aws-cdk-aws-iam-irole)</code> | <span></span>
**launchTemplate**🔹 | <code>[ILaunchtemplate](#cdk-spot-one-ilaunchtemplate)</code> | <span></span>
**spotFleetId**🔹 | <code>string</code> | <span></span>
**targetCapacity**?🔹 | <code>number</code> | __*Optional*__
**validUntil**?🔹 | <code>string</code> | __*Optional*__

### Methods


#### expireAfter(duration)🔹 <a id="cdk-spot-one-spotfleet-expireafter"></a>



```ts
expireAfter(duration: Duration): void
```

* **duration** (<code>[Duration](#aws-cdk-core-duration)</code>)  *No description*






## class VpcProvider 🔹 <a id="cdk-spot-one-vpcprovider"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable)
__Extends__: [Stack](#aws-cdk-core-stack)

### Initializer


Creates a new stack.

```ts
new VpcProvider(scope?: Construct, id?: string, props?: StackProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  Parent of this stack, usually a Program instance.
* **id** (<code>string</code>)  The construct ID of this stack.
* **props** (<code>[StackProps](#aws-cdk-core-stackprops)</code>)  Stack properties.
  * **description** (<code>string</code>)  A description of the stack. __*Default*__: No description.
  * **env** (<code>[Environment](#aws-cdk-core-environment)</code>)  The AWS environment (account/region) where this stack will be deployed. __*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
  * **stackName** (<code>string</code>)  Name to deploy the stack with. __*Default*__: Derived from construct path.
  * **synthesizer** (<code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code>)  Synthesis method to use while deploying this stack. __*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
  * **tags** (<code>Map<string, string></code>)  Stack tags that will be applied to all the taggable resources and the stack itself. __*Default*__: {}
  * **terminationProtection** (<code>boolean</code>)  Whether to enable termination protection for this stack. __*Default*__: false


### Methods


#### *static* getOrCreate(scope)🔹 <a id="cdk-spot-one-vpcprovider-getorcreate"></a>



```ts
static getOrCreate(scope: Construct): IVpc
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*

__Returns__:
* <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>



## struct BaseSpotFleetProps 🔹 <a id="cdk-spot-one-basespotfleetprops"></a>






Name | Type | Description 
-----|------|-------------
**blockDuration**?🔹 | <code>[BlockDuration](#cdk-spot-one-blockduration)</code> | __*Optional*__
**bootstrapEnabled**?🔹 | <code>boolean</code> | __*Optional*__
**customAmiId**?🔹 | <code>string</code> | __*Optional*__
**defaultInstanceType**?🔹 | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | __*Optional*__
**instanceInterruptionBehavior**?🔹 | <code>[InstanceInterruptionBehavior](#cdk-spot-one-instanceinterruptionbehavior)</code> | __*Optional*__
**instanceRole**?🔹 | <code>[Role](#aws-cdk-aws-iam-role)</code> | __*Optional*__
**mapRole**?🔹 | <code>boolean</code> | __*Optional*__
**physicalName**?🔹 | <code>string</code> | The value passed in by users to the physical name prop of the resource.<br/>__*Default*__: The physical name will be allocated by CloudFormation at deployment time
**targetCapacity**?🔹 | <code>number</code> | __*Optional*__
**terminateInstancesWithExpiration**?🔹 | <code>boolean</code> | __*Optional*__
**validFrom**?🔹 | <code>string</code> | __*Optional*__
**validUntil**?🔹 | <code>string</code> | __*Optional*__
**vpcSubnet**?🔹 | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | __*Optional*__



## interface ILaunchtemplate 🔹 <a id="cdk-spot-one-ilaunchtemplate"></a>

__Implemented by__: [LaunchTemplate](#cdk-spot-one-launchtemplate)


### Methods


#### bind(spotfleet)🔹 <a id="cdk-spot-one-ilaunchtemplate-bind"></a>



```ts
bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig
```

* **spotfleet** (<code>[SpotFleet](#cdk-spot-one-spotfleet)</code>)  *No description*

__Returns__:
* <code>[SpotFleetLaunchTemplateConfig](#cdk-spot-one-spotfleetlaunchtemplateconfig)</code>



## struct SpotFleetLaunchTemplateConfig 🔹 <a id="cdk-spot-one-spotfleetlaunchtemplateconfig"></a>

__Obtainable from__: [LaunchTemplate](#cdk-spot-one-launchtemplate).[bind](#cdk-spot-one-launchtemplate#cdk-spot-one-launchtemplate-bind)()





Name | Type | Description 
-----|------|-------------
**launchTemplate**🔹 | <code>[ILaunchtemplate](#cdk-spot-one-ilaunchtemplate)</code> | <span></span>
**spotfleet**🔹 | <code>[SpotFleet](#cdk-spot-one-spotfleet)</code> | <span></span>



## struct SpotFleetProps 🔹 <a id="cdk-spot-one-spotfleetprops"></a>






Name | Type | Description 
-----|------|-------------
**blockDuration**?🔹 | <code>[BlockDuration](#cdk-spot-one-blockduration)</code> | __*Optional*__
**bootstrapEnabled**?🔹 | <code>boolean</code> | __*Optional*__
**customAmiId**?🔹 | <code>string</code> | __*Optional*__
**defaultInstanceType**?🔹 | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | __*Optional*__
**eipAllocationId**?🔹 | <code>string</code> | __*Optional*__
**instanceInterruptionBehavior**?🔹 | <code>[InstanceInterruptionBehavior](#cdk-spot-one-instanceinterruptionbehavior)</code> | __*Optional*__
**instanceRole**?🔹 | <code>[Role](#aws-cdk-aws-iam-role)</code> | __*Optional*__
**launchTemplate**?🔹 | <code>[ILaunchtemplate](#cdk-spot-one-ilaunchtemplate)</code> | __*Optional*__
**mapRole**?🔹 | <code>boolean</code> | __*Optional*__
**physicalName**?🔹 | <code>string</code> | The value passed in by users to the physical name prop of the resource.<br/>__*Default*__: The physical name will be allocated by CloudFormation at deployment time
**targetCapacity**?🔹 | <code>number</code> | __*Optional*__
**terminateInstancesWithExpiration**?🔹 | <code>boolean</code> | __*Optional*__
**validFrom**?🔹 | <code>string</code> | __*Optional*__
**validUntil**?🔹 | <code>string</code> | __*Optional*__
**vpcSubnet**?🔹 | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | __*Optional*__



## enum BlockDuration 🔹 <a id="cdk-spot-one-blockduration"></a>



Name | Description
-----|-----
**ONE_HOUR** 🔹|
**TWO_HOURS** 🔹|
**THREE_HOURS** 🔹|
**FOUR_HOURS** 🔹|
**FIVE_HOURS** 🔹|
**SIX_HOURS** 🔹|


## enum InstanceInterruptionBehavior 🔹 <a id="cdk-spot-one-instanceinterruptionbehavior"></a>



Name | Description
-----|-----
**HIBERNATE** 🔹|
**STOP** 🔹|
**TERMINATE** 🔹|


