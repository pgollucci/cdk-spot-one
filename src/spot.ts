import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct, Resource, ResourceProps, PhysicalName, Stack, Fn, CfnOutput, Duration, Lazy } from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as cr from '@aws-cdk/custom-resources';

const DEFAULT_INSTANCE_TYPE = 't3.large'

export class VpcProvider extends Stack {
  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope)
    return stack.node.tryGetContext('use_default_vpc') === '1' ?
      ec2.Vpc.fromLookup(stack, 'Vpc', { isDefault: true }) :
      stack.node.tryGetContext('use_vpc_id') ?
        ec2.Vpc.fromLookup(stack, 'Vpc', { vpcId: stack.node.tryGetContext('use_vpc_id') }) :
        new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });
  }
}

export enum BlockDuration {
  ONE_HOUR = 60,
  TWO_HOURS = 120,
  THREE_HOURS = 180,
  FOUR_HOURS = 240,
  FIVE_HOURS = 300,
  SIX_HOURS = 360
}

export enum InstanceInterruptionBehavior {
  HIBERNATE = 'hibernate',
  STOP = 'stop',
  TERMINATE = 'terminate'
}

export interface SpotFleetLaunchTemplateConfig {
  readonly spotfleet: SpotFleet
  readonly launchTemplate: ILaunchtemplate;
}

export interface ILaunchtemplate {
  bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig;
}

export class LaunchTemplate implements ILaunchtemplate {
  public bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig {
    return {
      spotfleet,
      launchTemplate: this,
    }
  }
}

export interface BaseSpotFleetProps extends ResourceProps {
  /**
   * VPC for the spot fleet
   * 
   * @default - new VPC will be created
   * 
   */
  readonly vpc?: ec2.IVpc;

  /**
   * default EC2 instance type
   * 
   * @default - t3.large
   */
  readonly defaultInstanceType?: ec2.InstanceType;

  /**
   * reservce the spot instance as spot block with defined duration
   * 
   * @default - BlockDuration.ONE_HOUR
   */
  readonly blockDuration?: BlockDuration;

  /**
   * The behavior when a Spot Instance is interrupted
   * 
   * @default - InstanceInterruptionBehavior.TERMINATE
   */
  readonly instanceInterruptionBehavior?: InstanceInterruptionBehavior;

  /**
   * IAM role for the spot instance
   */
  readonly instanceRole?: iam.Role;

  /**
   * number of the target capacity
   * 
   * @default - 1
   */
  readonly targetCapacity?: number;

  /**
   * the time when the spot fleet allocation starts
   * 
   * @default - no expiration
   */
  readonly validFrom?: string;

  /**
   * the time when the spot fleet allocation expires
   * 
   * @default - no expiration
   */
  readonly validUntil?: string;

  /**
   * terminate the instance when the allocation is expired
   * 
   * @default - true
   */
  readonly terminateInstancesWithExpiration?: boolean;

  /**
   * custom AMI ID
   * 
   * @default - The latest Amaozn Linux 2 AMI ID
   */
  readonly customAmiId?: string;

  /**
   * VPC subnet for the spot fleet
   * 
   * @default - public subnet
   */
  readonly vpcSubnet?: ec2.SubnetSelection;

  /**
   * SSH key name
   * 
   * @default - no ssh key will be assigned
   */
  readonly keyName?: string;

}

export interface SpotFleetProps extends BaseSpotFleetProps {
  /**
   * Launch template for the spot fleet
   */
  readonly launchTemplate?: ILaunchtemplate;

  /**
   * Allocation ID for your existing Elastic IP Address. 
   * 
   * @defalt new EIP and its association will be created for the first instance in this spot fleet
   */
  readonly eipAllocationId?: string;

}

export class SpotFleet extends Resource {
  readonly instanceRole: iam.IRole;
  readonly defaultInstanceType: ec2.InstanceType;
  readonly targetCapacity?: number;
  readonly spotFleetId: string;
  readonly launchTemplate: ILaunchtemplate;
  readonly vpc: ec2.IVpc;
  /**
   * the first instance id in this fleet
   */
  readonly instanceId: string;
  /**
   * instance type of the first instance in this fleet
   */
  readonly instanceType: string;
  /**
   * SpotFleetRequestId for this spot fleet
   */
  readonly spotFleetRequestId: string;
  /**
   * The time when the the fleet allocation will expire
   */
  private validUntil?: string;

  constructor(scope: Construct, id: string, props: SpotFleetProps = {}) {
    super(scope, id, props)

    this.spotFleetId = id
    this.launchTemplate = props.launchTemplate ?? new LaunchTemplate()
    this.targetCapacity = props.targetCapacity ?? 1
    this.defaultInstanceType = props.defaultInstanceType ?? new ec2.InstanceType(DEFAULT_INSTANCE_TYPE)
    this.validUntil = props.validUntil 
    this.vpc = props.vpc ?? new ec2.Vpc(this, 'VPC', { maxAzs: 3, natGateways: 1})

    // isntance role
    this.instanceRole = props.instanceRole || new iam.Role(this, 'InstanceRole', {
      roleName: PhysicalName.GENERATE_IF_NEEDED,
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    this.instanceRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'ssmmessages:*',
        'ssm:UpdateInstanceInformation',
        'ec2messages:*',
      ],
      resources: ['*'],
    }));

    const instanceProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
      roles: [this.instanceRole.roleName],
    })

    const sg = new ec2.SecurityGroup(this, 'SpotFleetSg', {
      vpc: this.vpc,
    })

    sg.connections.allowFromAnyIpv4(ec2.Port.tcp(22))

    this.defaultInstanceType = props.defaultInstanceType ?? new ec2.InstanceType(DEFAULT_INSTANCE_TYPE)

    const imageId = props.customAmiId ?? ec2.MachineImage.latestAmazonLinux({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }).getImage(this).imageId


    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm',
      'yum install -y docker',
      'usermod -aG docker ec2-user',
      'usermod -aG docker ssm-user',
      'service docker start',
    );
    const lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
      launchTemplateData: {
        imageId,
        instanceType: this.defaultInstanceType.toString(),
        userData: Fn.base64(userData.render()),
        keyName: props.keyName,
        tagSpecifications: [
          {
            resourceType: 'instance',
            tags: [
              {
                key: 'Name',
                value: `${Stack.of(this).stackName}/spotFleet/${this.spotFleetId}`,
              },
            ],
          },
        ],
        instanceMarketOptions: {
          marketType: 'spot',
          spotOptions: {
            blockDurationMinutes: props.blockDuration ?? BlockDuration.ONE_HOUR,
            instanceInterruptionBehavior: props.instanceInterruptionBehavior ?? InstanceInterruptionBehavior.TERMINATE,
          },
        },
        securityGroupIds: sg.connections.securityGroups.map(m => m.securityGroupId),
        iamInstanceProfile: {
          arn: instanceProfile.attrArn,
        },
      },
    })

    const spotFleetRole = new iam.Role(this, 'FleetRole', {
      assumedBy: new iam.ServicePrincipal('spotfleet.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2SpotFleetTaggingRole'),
      ],
    })

    const vpcSubnetSelection = props.vpcSubnet ?? {
      subnetType: ec2.SubnetType.PUBLIC,
    }
    const subnetConfig = this.vpc.selectSubnets(vpcSubnetSelection).subnets.map(s => ({
      subnetId: s.subnetId,
    }))
    const cfnSpotFleet = new ec2.CfnSpotFleet(this, id, {
      spotFleetRequestConfigData: {
        launchTemplateConfigs: [
          {
            launchTemplateSpecification: {
              launchTemplateId: lt.ref,
              version: lt.attrLatestVersionNumber,
            },
            overrides: subnetConfig,
          },
        ],
        iamFleetRole: spotFleetRole.roleArn,
        targetCapacity: props.targetCapacity ?? 1,
        validFrom: props.validFrom,
        validUntil: Lazy.stringValue({ produce: () => this.validUntil }),
        terminateInstancesWithExpiration: props.terminateInstancesWithExpiration ?? true,
      },
    })
    new CfnOutput(this, 'SpotFleetId', { value: cfnSpotFleet.ref })

    const fleetInstances = new cr.AwsCustomResource(this, 'DescribeSpotFleetInstances', {
      onUpdate: {
        service: 'EC2',
        action: 'describeSpotFleetInstances',
        parameters: {
          SpotFleetRequestId: cfnSpotFleet.ref,
        },
        // Update physical id to always fetch the latest version
        physicalResourceId: cr.PhysicalResourceId.of(cfnSpotFleet.ref),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    fleetInstances.node.addDependency(cfnSpotFleet)
    this.instanceId = fleetInstances.getResponseField('ActiveInstances.0.InstanceId')
    this.instanceType = fleetInstances.getResponseField('ActiveInstances.0.InstanceType')
    this.spotFleetRequestId = fleetInstances.getResponseField('SpotFleetRequestId')

    new CfnOutput(this, 'InstanceId', { value: this.instanceId })

    // EIP association
    if (props.eipAllocationId) {
      new ec2.CfnEIPAssociation(this, 'EipAssocation', {
        allocationId: props.eipAllocationId,
        instanceId: this.instanceId,
      })
    } else {
      new ec2.CfnEIP(this, 'EIP', {
        instanceId: this.instanceId,
      })
    }
  }
  public expireAfter(duration: Duration) {
    const date = new Date();
    date.setSeconds(date.getSeconds() + duration.toSeconds());
    this.validUntil = date.toISOString();
  }
}
