import { LanguageSelector } from './language_selector';
import './title_bar.css';

export function TitleBar(): React.JSX.Element {
  return (
    <header className="titlebar">
      <div className="content-region">
        <div className="control"></div>
        <div className="space"></div>
        <div className="control"></div>
        <div className="space"></div>
        <div className="control">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
