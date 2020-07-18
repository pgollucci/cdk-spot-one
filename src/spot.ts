import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct, Resource, ResourceProps, PhysicalName, Stack, Fn, CfnOutput, Duration } from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as cr from '@aws-cdk/custom-resources';

const DEFAULT_INSTANCE_TYPE = 't3.large'

export class VpcProvider extends Stack {
  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope)
    const vpc = stack.node.tryGetContext('use_default_vpc') === '1' ?
      ec2.Vpc.fromLookup(stack, 'Vpc', { isDefault: true }) :
      stack.node.tryGetContext('use_vpc_id') ?
        ec2.Vpc.fromLookup(stack, 'Vpc', { vpcId: stack.node.tryGetContext('use_vpc_id') }) :
        new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });

    return vpc
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
  readonly defaultInstanceType?: ec2.InstanceType;
  readonly blockDuration?: BlockDuration;
  readonly instanceInterruptionBehavior?: InstanceInterruptionBehavior;
  readonly instanceRole?: iam.Role;
  readonly targetCapacity?: number;
  readonly mapRole?: boolean;
  readonly bootstrapEnabled?: boolean;
  readonly validFrom?: string;
  readonly validUntil?: string;
  readonly terminateInstancesWithExpiration?: boolean;
  readonly customAmiId?: string;
  readonly vpcSubnet?: ec2.SubnetSelection;
}

export interface SpotFleetProps extends BaseSpotFleetProps {
  readonly launchTemplate?: ILaunchtemplate;
  readonly eipAllocationId?: string;
}

export class SpotFleet extends Resource {
  readonly instanceRole: iam.IRole;
  readonly defaultInstanceType: ec2.InstanceType;
  readonly targetCapacity?: number;
  readonly spotFleetId: string;
  readonly launchTemplate: ILaunchtemplate;
  validUntil?: string;


  constructor(scope: Construct, id: string, props: SpotFleetProps) {
    super(scope, id, props)

    this.spotFleetId = id
    this.launchTemplate = props.launchTemplate ?? new LaunchTemplate()
    this.targetCapacity = props.targetCapacity
    this.defaultInstanceType = props.defaultInstanceType ?? new ec2.InstanceType(DEFAULT_INSTANCE_TYPE)
    this.validUntil = props.validUntil 

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

    const vpc = VpcProvider.getOrCreate(this)

    const sg = new ec2.SecurityGroup(this, 'SpotFleetSg', {
      vpc,
    })

    sg.connections.allowFromAnyIpv4(ec2.Port.tcp(22))

    // const config = this.launchTemplate.bind(this)

    this.defaultInstanceType = props.defaultInstanceType ?? new ec2.InstanceType(DEFAULT_INSTANCE_TYPE)

    const imageId = ec2.MachineImage.latestAmazonLinux({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }).getImage(this).imageId


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
        keyName: 'aws-pahud',
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

    const subnetConfig = vpc.selectSubnets(props.vpcSubnet).subnets.map(s => ({
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
        validUntil: props.validUntil,
        terminateInstancesWithExpiration: props.terminateInstancesWithExpiration,
      },
    })
    new CfnOutput(this, 'SpotFleetId', { value: cfnSpotFleet.ref })

    const fleetInstances = new cr.AwsCustomResource(this, 'API1', {
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
    const instanceId = fleetInstances.getResponseField('ActiveInstances.0.InstanceId')
    new CfnOutput(this, 'InstanceId', { value: instanceId })

    // EIP association
    if (props.eipAllocationId) {
      new ec2.CfnEIPAssociation(this, 'EipAssocation', {
        allocationId: props.eipAllocationId,
        instanceId,
      })
    } else {
      new ec2.CfnEIP(this, 'EIP', {
        instanceId,
      })
    }
  }
  public expireAfter(duration: Duration) {
    const date = new Date();
    date.setSeconds(date.getSeconds() + duration.toSeconds());
    this.validUntil = date.toISOString();
  }
}
