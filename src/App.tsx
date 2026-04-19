import '@/styles/base.scss';
import configLocalization from './configs/Localization';
import PublicRoutes from './routes/PublicRoutes';
import {
  AppAnalytics,
  CommonProvider,
  ErrorBoundary,
} from '@tycho-platform/components';

export default function App() {
  configLocalization();

  return (
    <CommonProvider>
      <ErrorBoundary>
        <AppAnalytics />
        <PublicRoutes />
      </ErrorBoundary>
    </CommonProvider>
  );
}
