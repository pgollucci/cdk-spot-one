const {
  ConstructLibraryAws,
} = require('projen');

const LAST_AWSCDK_VERSION = '1.61.0';

const project = new ConstructLibraryAws({
  "authorName": "Pahud Hsieh",
  "authorEmail": "pahudnet@gmail.com",
  "name": "cdk-spot-one",
  "description": "One spot instance with EIP and defined duration. No interruption.",
  "repository": "https://github.com/pahud/cdk-spot-one.git",

  keywords: ["cdk", "spot", "aws"],

  catalog: {
    twitter: 'pahudnet',
    announce: false,
  },

  // creates PRs for projen upgrades
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  cdkVersion: LAST_AWSCDK_VERSION,

  cdkDependencies: [
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-lambda",
    "@aws-cdk/aws-logs",
    "@aws-cdk/core",
    "@aws-cdk/custom-resources"
  ],

  python: {
    distName: 'cdk-spot-one',
    module: 'cdk_spot_one'
  }
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

project.synth();
