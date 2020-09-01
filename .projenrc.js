const {
  ConstructLibraryAws,
} = require('projen');

const AWS_CDK_LATEST_RELEASE = '1.61.1';
const PROJEN_PINNED_VERSION = '0.3.50';

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

  cdkVersion: AWS_CDK_LATEST_RELEASE,

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

if (PROJEN_PINNED_VERSION) {
  project.devDependencies.projen = PROJEN_PINNED_VERSION;
}

const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
