#!/usr/bin/env node

import program from 'commander';
import { startBrowser, stopBrowser, run } from '../index';

program
  .name("braids")
  .description("Gets performance data for a url and prints to stdout")

program
  .command("run <url>")
  .action(async (url) => {
    if (!url) {
      console.log('braids run needs a url to analyze');
      process.exit(1);
    }
    await startBrowser();

    const data = await run({ url });

    stopBrowser();

    process.stdout.write(JSON.stringify(data, null, 2));
  });

program.parse(process.argv);