# React App With Protected Routes App Example

## Set up

```
# Install dependencies
npm install

# Start development server
npm run start
```

## Important concepts

This application relies on the *AppProvider* component available in the `@8base/react-sdk` npm package. The *AppProvider* accepts an *authClient* and *uri* property, from which it is able to handle in app authentication flows. 

### URI
`uri` is simply the endpoint of an 8base workspace. 

### authClient (`openid-app/src/authClient.js`)

The `authClient` is a JavaScript object that encapsulates any authentication and authorization logic. Each function handles a discrete respensibility for managing the auth lifecycle.

*Note: These following are controlled fully by the front-end developer. The choice of whether to use the AppProvider is completely up to them. Authentication and authorization can still be implimented using custom logic and components.*

##### authorize
Load's the specified authentication page for the external provider.
```javascript
authorize: () => {
  window.location.href = encodeURI(`${IBM_APP_ID_OAUTH_URL}/authorization?client_id=${IBM_APP_ID_CLIENT_ID}&scope=openid&response_type=code&redirect_uri=http://localhost:3000/auth`);
}
```

##### getAuthState
Fetches the current auth state from the browsers `localStorage` object.
```javascript
getAuthState: () => {
  const auth = JSON.parse(localStorage.getItem(AUTH_LOCALSTORAGE_KEY) || '{}');
  return auth || {};
}
```

##### setAuthState
Updates the auth state in `localStorage` by merging it with an updated auth payload. 
```javascript
setAuthState: (newState) => {
  const currentState = authClient.getAuthState();

  const mergedState = {
    ...currentState,
    ...newState,
  };

  localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(mergedState));
}
````

##### purgeAuthState
Delete auth state persisted in local storage while optionally forcing logout redirect.
```javascript
purgeAuthState: ({ withLogout }) => {
  localStorage.removeItem(AUTH_LOCALSTORAGE_KEY);

  if (withLogout) {
    authClient.logout();
  }
}
 ```

##### logout
Reloads application at root path.
```javascript
logout: () => {
  window.location.href = '/';
}
```

##### checkIsAuthorized
Determines whether the current user is authorized based the existence of a token in `localStorage`.

```javascript
checkIsAuthorized: () => {
  const { token } = authClient.getAuthState();

  return token !== '' && token !== null && token !== undefined;
}
```