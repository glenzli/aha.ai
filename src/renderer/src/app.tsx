import { Tldraw } from 'tldraw';
import { getAssetUrls } from '@tldraw/assets/selfHosted';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/language_switcher';
import 'tldraw/tldraw.css';

function App(): React.JSX.Element {
  const { t } = useTranslation();
  const assetUrls = getAssetUrls({ baseUrl: './tldraw-assets' });

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </header>
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
