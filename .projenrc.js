const {
  JsiiProject,
  Semver
} = require('projen');

const AWS_CDK_LATEST_RELEASE = '1.60.0';
const CONSTRUCTS_VERSION = '3.0.4';
const PROJECT_NAME = 'cdk-spot-one';
const PROJECT_DESCRIPTION = 'One spot instance with EIP and defined duration. No interruption.';

const project = new JsiiProject({
  name: PROJECT_NAME,
  jsiiVersion: Semver.caret('1.5.0'),
  description: PROJECT_DESCRIPTION,
  repository: 'https://github.com/pahud/cdk-spot-one.git',
  authorName: 'Pahud Hsieh',
  authorEmail: 'pahudnet@gmail.com',
  stability: 'experimental',
  devDependencies: {
    '@aws-cdk/assert': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@types/jest': Semver.caret('25.2.3'),
    '@types/node': Semver.caret('14.0.11'),
    'dot-prop': Semver.caret('5.1.1'),
  },
  peerDependencies: {
    'constructs': Semver.pinned(CONSTRUCTS_VERSION),
    '@aws-cdk/core': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-iam': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-ec2': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-lambda': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-logs': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/custom-resources': Semver.pinned(AWS_CDK_LATEST_RELEASE),
  },
  dependencies: {
    'constructs': Semver.pinned(CONSTRUCTS_VERSION),
    '@aws-cdk/core': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-iam': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-ec2': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-lambda': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-logs': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/custom-resources': Semver.pinned(AWS_CDK_LATEST_RELEASE),
  },
  python: {
    distName: 'cdk-spot-one',
    module: 'cdk_spot_one'
  }
});

project.addFields({
  'keywords': [
    'cdk',
    'spot',
    'aws',
  ]
});

project.gitignore.exclude(
  'cdk.context.json',
  'cdk.out'
);


project.npmignore.exclude(
  'cdk.context.json',
  'cdk.out',
  'coverage',
  'yarn-error.log',
);

// override the version to 1.4.0 tentatively 
project.addDevDependencies({
  'jsii-docgen': Semver.pinned('1.4.0'),
})

project.addFields({
  awscdkio: {
    twitter: '@pahudnet',
    announce: false
  }
})

project.synth();
