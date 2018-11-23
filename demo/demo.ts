import * as readline from 'readline';

import { DemoProgram } from './program';

/**
 * Demo
 */
if (process.argv[2]) {
  run(process.argv[2]);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('What server do you want tu run? [node, customNode, customChrome]: ', answer => {
    run(answer);
    rl.close();
  });
}

function run(param: string) {
  const demo = new DemoProgram();
  switch (param) {
    case 'node':
      demo.startNode();
      break;
    case 'customNode':
      demo.startCustomNode();
      break;
    case 'customChrome':
      demo.startCustomChrome();
      break;

    default:
      throw new Error(`Unsupported server: ${param}`);
  }
}
