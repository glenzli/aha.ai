import { Dropdown, Button } from 'antd';
import { TranslationOutlined, CheckOutlined } from '@ant-design/icons';
import './language_selector.css';

export function LanguageSelector(): React.JSX.Element {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng);
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'en',
            label: (
              <div className="language-menu-item">
                <span className="language-menu-item-check">
                  {i18n.language === 'en' ? <CheckOutlined /> : null}
                </span>
                <span>English</span>
              </div>
            ),
            onClick: () => changeLanguage('en'),
          },
          {
            key: 'zh',
            label: (
              <div className="language-menu-item">
                <span className="language-menu-item-check">
                  {i18n.language === 'zh' ? <CheckOutlined /> : null}
                </span>
                <span>中文</span>
              </div>
            ),
            onClick: () => changeLanguage('zh'),
          },
        ],
      }}
      trigger={['click']}
    >
      <Button
        type="text"
        icon={<TranslationOutlined />}
        aria-label={t('ui.label.language')}
        size="small"
      />
    </Dropdown>
  );
}
