import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout.js';
import { LandingScreen } from './screens/LandingScreen.js';
import { OwnerDashboardScreen } from './screens/OwnerDashboardScreen.js';
import { CreateVaultScreen } from './screens/CreateVaultScreen.js';
import { ExecutorDashboardScreen } from './screens/ExecutorDashboardScreen.js';
import { BeneficiaryDashboardScreen } from './screens/BeneficiaryDashboardScreen.js';
import { SignTransferScreen } from './screens/SignTransferScreen.js';
import { AppealScreen } from './screens/AppealScreen.js';
import { DeathConfirmationScreen } from './screens/DeathConfirmationScreen.js';
import { DepositHistoryScreen } from './screens/DepositHistoryScreen.js';
import { VaultCertificateScreen } from './screens/VaultCertificateScreen.js';
import { WalletProvider } from './context/WalletContext.js';

export function App() {
    return (
        <WalletProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingScreen />} />
                    <Route path="/sign" element={<SignTransferScreen />} />
                    <Route element={<AppLayout />}>
                        <Route path="/app" element={<Navigate to="/owner" replace />} />
                        <Route path="/owner" element={<OwnerDashboardScreen />} />
                        <Route path="/create" element={<CreateVaultScreen />} />
                        <Route path="/executor" element={<ExecutorDashboardScreen />} />
                        <Route path="/beneficiary" element={<BeneficiaryDashboardScreen />} />
                        <Route path="/appeal" element={<AppealScreen />} />
                        <Route path="/death" element={<DeathConfirmationScreen />} />
                        <Route path="/deposits" element={<DepositHistoryScreen />} />
                        <Route path="/certificate" element={<VaultCertificateScreen />} />
                        <Route path="*" element={<Navigate to="/owner" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </WalletProvider>
    );
}
