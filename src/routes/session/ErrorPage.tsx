import logo from '@/assets/img/logo.svg';
import { useState } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './style.scss';

export default function ErrorPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const error = useRouteError();
  const [show, setShow] = useState(false);

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className="box-container">
      <div className="box">
        <img src={logo} alt="" />
        <h1 className="title">{t('error.label.title')}</h1>
        <div className="disclaimer" onClick={handleRedirect}>
          {t('error.label.redirect')}
        </div>
        <div
          className="error-details"
          onClick={() => setShow((prevState) => !prevState)}
        >
          {t('error.label.details')}
        </div>
      </div>
      {show && (
        <pre className="error-stack">{JSON.stringify(error, null, 2)}</pre>
      )}
    </div>
  );
}
