import { Tldraw } from 'tldraw';
import { getAssetUrls } from '@tldraw/assets/selfHosted';
import 'tldraw/tldraw.css';

function App(): React.JSX.Element {
  const assetUrls = getAssetUrls({ baseUrl: './tldraw-assets' });
  return (
    <div className="app">
      <Tldraw
        assetUrls={assetUrls}
        components={{
          Toolbar: null,
          StylePanel: null,
        }}
      />
    </div>
  );
}

export default App;
