const {
  AwsCdkConstructLibrary,
  GithubWorkflow,
} = require('projen');

const AWS_CDK_LATEST_RELEASE = '1.62.0';
const PROJECT_NAME = 'cdk-spot-one';
const PROJECT_DESCRIPTION = 'One spot instance with EIP and defined duration. No interruption.';
const AUTOMATION_TOKEN = 'AUTOMATION_GITHUB_TOKEN';


const project = new AwsCdkConstructLibrary({
  "authorName": "Pahud Hsieh",
  "authorEmail": "pahudnet@gmail.com",
  "name": PROJECT_NAME,
  "description": PROJECT_DESCRIPTION,
  "repository": "https://github.com/pahud/cdk-spot-one.git",
  antitamper: false,
  keywords: ["cdk", "spot", "aws"],
  catalog: {
    twitter: 'pahudnet',
    announce: false,
  },
  dependabot: false,
  projenUpgradeSchedule: ['0 0 * * 0'],
  // creates PRs for projen upgrades
  projenUpgradeSecret: AUTOMATION_TOKEN,
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


// create a custom projen and yarn upgrade workflow
const workflow = new GithubWorkflow(project, 'YarnUpgrade');

workflow.on({
  schedule: [{
    cron: '0 0 * * *'
  }], // 0am every day
  workflow_dispatch: {}, // allow manual triggering
});

workflow.addJobs({
  upgrade: {
    'runs-on': 'ubuntu-latest',
    'steps': [
      // ...project.workflowBootstrapSteps,
      // yarn upgrade
      {
        uses: 'actions/checkout@v2',
      },
      {
        uses: 'actions/setup-node@v1',
        with: {
          'node-version': '10.17.0',
        },
      },
      {
        run: `yarn upgrade`
      },
      {
        run: `git restore package.json`
      },
      // submit a PR
      {
        name: 'Create Pull Request',
        uses: 'peter-evans/create-pull-request@v3',
        with: {
          'token': '${{ secrets.' + AUTOMATION_TOKEN + '}}',
          'commit-message': 'chore: yarn upgrade',
          'branch': 'auto/yarn-upgrade',
          'title': 'chore: yarn upgrade',
          'body': 'This PR executes yarn upgrade to the latest version',
        }
      },
    ],
  },
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
