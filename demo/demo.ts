import readline = require('readline');
import { DemoProgram } from './program';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What server do you want tu run? [node, customNode, customChrome]: ', (answer) => {
  const demo = new DemoProgram();
  switch (answer) {
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
      break;
  }

  rl.close();
});