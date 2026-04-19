import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '@tycho-platform/components';

export default function WrapperOutlet() {
  const { t } = useTranslation('home');
  const navigate = useNavigate();

  return (
    <>
      <Header tool={t('label.tool')} />
      <Outlet />
    </>
  );
}
