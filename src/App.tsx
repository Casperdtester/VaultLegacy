import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingScreen } from './screens/LandingScreen';
import { OwnerDashboardScreen } from './screens/OwnerDashboardScreen';
import { CreateVaultScreen } from './screens/CreateVaultScreen';
import { ExecutorDashboardScreen } from './screens/ExecutorDashboardScreen';
import { BeneficiaryDashboardScreen } from './screens/BeneficiaryDashboardScreen';
import { SignTransferScreen } from './screens/SignTransferScreen';
import { AppealScreen } from './screens/AppealScreen';
import { DeathConfirmationScreen } from './screens/DeathConfirmationScreen';
import { DepositHistoryScreen } from './screens/DepositHistoryScreen';
import { VaultCertificateScreen } from './screens/VaultCertificateScreen';

export function App(): React.ReactElement {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing page â€” standalone, no sidebar */}
                <Route path="/" element={<LandingScreen />} />

                {/* Signing screen â€” standalone, no sidebar */}
                <Route path="/sign" element={<SignTransferScreen />} />

                {/* All other screens use the full layout */}
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
    );
}
