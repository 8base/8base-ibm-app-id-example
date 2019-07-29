const IBM_APP_ID_TENANT_ID = '615a6bf1-3bd1-47a4-9a91-0ddb062652ba';
const IBM_APP_ID_OAUTH_URL = `https://eu-de.appid.cloud.ibm.com/oauth/v4/${IBM_APP_ID_TENANT_ID}`
const IBM_APP_ID_CLIENT_ID = '484ab396-f894-4391-83ec-64740d8617bd';

export const AUTH_PROFILE_ID = 'cjyob0tyl00o601joamqx199q';

const AUTH_LOCALSTORAGE_KEY = 'auth';

export const authClient = {
  authorize: () => {
    window.location.href = encodeURI(`${IBM_APP_ID_OAUTH_URL}/authorization?client_id=${IBM_APP_ID_CLIENT_ID}&scope=openid&response_type=code&redirect_uri=http://localhost:3000/auth`);
  },

  getAuthState: () => {
    const auth = JSON.parse(localStorage.getItem(AUTH_LOCALSTORAGE_KEY) || '{}');
    return auth || {};
  },

  setAuthState: (newState) => {
    const currentState = authClient.getAuthState();

    const mergedState = {
      ...currentState,
      ...newState,
    };

    localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(mergedState));
  },

  purgeAuthState: ({ withLogout }) => {
    localStorage.removeItem(AUTH_LOCALSTORAGE_KEY);

    if (withLogout) {
      authClient.logout();
    }
  },

  logout: () => {
    window.location.href = '/';
  },

  checkIsAuthorized: () => {
    const { token } = authClient.getAuthState();

    return token !== '' && token !== null && token !== undefined;
  },
};