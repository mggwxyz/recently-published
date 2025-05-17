import {Text} from 'ink';
import Spinner from 'ink-spinner';

export const Loader = ({count, total}: {count: number; total: number}) => {
  return (
    <>
      <Text>
        {`${total === 0 || count === 0 ? 'Fetching metadata for packages' : `Fetched metadata for ${count} of ${total} packages`}`}
        <Text color='green'>
          <Spinner type='simpleDots' />
        </Text>
      </Text>
    </>
  );
};
