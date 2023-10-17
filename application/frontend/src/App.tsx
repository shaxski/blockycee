import './App.css';
import { QRCodeSVG } from 'qrcode.react';

function App() {
  const qrText = JSON.stringify({
    "CertificationId": "ProCertId-Kai1",
    "SignedData": "Sq9tIVqs65kl8ywFL9VUX54j+DO3JCspnot/wgpUpiNLZyy+q6nazH2eD03b4sB7fMV8UcYVAavvL0I4Qib3+7Cl72J0M89wjQMtlNo4Ylt7kcgfD1Nm3sdMsvABmRy4SwgwMOKo8pFYMM1gbCOtIhn2JANYTmO1UQNCG4R79UVpRG1lEYHksnXWEYNXK9Vz5jSVOjCq018w31rHBscJTvnSCL5toMkttp+qg601jbD4OnEIntW6S4A++sFjEVls+ShJfms40XT1KgnnWpZg7YJ+jQUXAmfsHzeR4YASLf+Ym6g98boE6qGuy//g9EK75rXiHEZMPsNIQZDtCXxeSw=="
})
  return (
    <div className="App">
      <header className="App-header">
        <QRCodeSVG value={qrText} />
      </header>
    </div>
  );
}

export default App;
