import '@/styles/base.scss';
import configLocalization from './configs/Localization';
import PublicRoutes from './routes/PublicRoutes';

export default function App() {
  configLocalization();

  return (
    <main>
      <PublicRoutes />
    </main>
  );
}
