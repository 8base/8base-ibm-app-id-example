const AUTH_LOCALSTORAGE_KEY = 'auth';

export const authClient = {
  authorize: () => {
    window.location.href = `http://localhost:3000/authenticate`;
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

  purgeAuthState: async ({ withLogout }) => {
    localStorage.removeItem(AUTH_LOCALSTORAGE_KEY);

    if (withLogout) {
      authClient.logout();
    }
  },

  checkIsAuthorized: () => {
    const { token } = authClient.getAuthState();

    return token !== '' && token !== null && token !== undefined;
  },
  logout: () => {
    window.location.href = `http://localhost:3000/logout`;
  },
};