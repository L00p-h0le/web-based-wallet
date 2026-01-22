import { useState } from 'react';
import { ThemeProvider } from './context';
import { Layout, WalletCreation, WalletDashboard } from './components';

function App() {
  const [walletCreated, setWalletCreated] = useState(false);

  console.log("App Rendering, mode:", walletCreated ? "Dashboard" : "Creation");

  return (
    <ThemeProvider>
      <Layout>
        {!walletCreated ? (
          <WalletCreation onWalletCreated={() => setWalletCreated(true)} />
        ) : (
          <WalletDashboard onDeleteAll={() => setWalletCreated(false)} />
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
