import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { AppLayout } from '../layout';

dayjs.extend(weekday);
dayjs.extend(localeData);

function App(): React.JSX.Element {
  return (
    <div className="app">
      <AppLayout />
    </div>
  );
}

export default App;
