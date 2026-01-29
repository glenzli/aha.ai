import { Tldraw } from 'tldraw';
import { getAssetUrls } from '@tldraw/assets/selfHosted';
import { AppLayout } from '../layout';
import 'tldraw/tldraw.css';

function App(): React.JSX.Element {
  const assetUrls = getAssetUrls({ baseUrl: './tldraw-assets' });

  return (
    <div className="app">
      <AppLayout
        contentPanel={<Tldraw
          assetUrls={assetUrls}
          components={{
            Toolbar: null,
            StylePanel: null,
          }}
        />}
      />
    </div>
  );
}

export default App;
