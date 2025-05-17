import {exec} from 'child_process';
import {mkdir, existsSync, exists} from 'fs';
import {promisify} from 'util';
import pWaitFor from 'p-wait-for';

const existsAsync = promisify(exists);
const execAsync = promisify(exec);
const mkdirAsync = promisify(mkdir);

async function generateDemoGif() {
  try {
    // Create gifs directory if it doesn't exist
    if (!existsSync('demo/gifs')) {
      await mkdirAsync('demo/gifs');
    }

    if (existsSync('demo/demo.cast')) {
      await execAsync('rm -f demo/demo.cast');
    }

    await execAsync('pnpm install', {
      cwd: 'demo/my-react-app'
    });

    // Record the terminal session
    console.log('Starting asciinema recording...');
    await execAsync(
      'asciinema rec --command "../../scripts/npx-recently-published.sh" demo.cast --overwrite --rows=20 --cols=100',
      {
        cwd: 'demo/my-react-app'
      }
    );

    // Wait for demo.cast to be created using p-wait-for
    await pWaitFor(() => existsSync('demo/my-react-app/demo.cast'), {
      interval: 1000,
      timeout: 10000
    });

    await execAsync('mv demo/my-react-app/demo.cast demo/demo.cast');

    // Convert the recording to GIF using agg
    console.log('Converting recording to GIF...');
    await execAsync('agg demo/demo.cast demo/gifs/demo.gif');

    console.log('Demo GIF has been generated successfully at demo/gifs/demo.gif');
  } catch (error) {
    console.error('Error generating demo GIF:', error);
    process.exit(1);
  }
}

// Run the script
generateDemoGif();
