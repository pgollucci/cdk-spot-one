const {
  ConstructLibraryAws,
} = require('projen');

const project = new ConstructLibraryAws({
  "authorName": "Pahud Hsieh",
  "authorEmail": "pahudnet@gmail.com",
  "name": "cdk-spot-one",
  "description": "One spot instance with EIP and defined duration. No interruption.",
  "repository": "https://github.com/pahud/cdk-spot-one.git",
  keywords: [
    "cdk",
    "spot",
    "aws"
  ],

  catalog: {
    twitter: 'pahudnet',
    announce: 'false'
  },

  // creates PRs for projen upgrades
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  cdkVersion: '1.60.0',
  cdkDependencies: [
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-lambda",
    "@aws-cdk/aws-logs",
    "@aws-cdk/core",
    "@aws-cdk/custom-resources"
  ],
  // devDependencies: {
  //   "aws-sdk": Semver.caret("2.708.0")
  // },

  // jsii publishing
  // java: {
  //   javaPackage: 'com.github.pahud.cdk-spot-one',
  //   mavenGroupId: 'com.github.pahud',
  //   mavenArtifactId: 'cdk-spot-one'
  // },

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
