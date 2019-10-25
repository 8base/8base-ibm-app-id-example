import React from 'react';
import { AppProvider } from '8base-react-sdk';
import { Auth, AUTH_STRATEGIES } from '8base-sdk';
import { BrowserRouter } from 'react-router-dom';

import { Routes } from './routes';

const API_ENDPOINT_URI = 'https://api.8base.com/cjyo4i5fh01ie01mjf11x8mlm';
const IBM_APP_ID_TENANT_ID = '615a6bf1-3bd1-47a4-9a91-0ddb062652ba';
const IBM_APP_ID_OAUTH_URL = `https://eu-de.appid.cloud.ibm.com/oauth/v4/${IBM_APP_ID_TENANT_ID}`;
const IBM_APP_ID_CLIENT_ID = '484ab396-f894-4391-83ec-64740d8617bd';

const authClient = Auth.createClient({
  strategy: AUTH_STRATEGIES.WEB_OAUTH,
  subscribable: true,
}, {
  authorize (email, password) {
    window.location.href = encodeURI(`${IBM_APP_ID_OAUTH_URL}/authorization?client_id=${IBM_APP_ID_CLIENT_ID}&scope=openid&response_type=code&redirect_uri=http://localhost:3000/auth`);
  },
  logout() {
    window.addEventListener('unload', () => {
      this.purgeState();
    });

    window.location.href = '/';
  }
});

const renderAppContent = ({ loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

const App = () => (
  <AppProvider uri={ API_ENDPOINT_URI } authClient={ authClient }>
    {renderAppContent}
  </AppProvider>
);

export { App };
