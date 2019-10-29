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

### authClient ([@8base/web-oauth-client](https://github.com/8base/sdk/tree/master/packages/web-oauth-client))

The `authClient` is a JavaScript object that encapsulates authentication and authorization logic. Each function handles a discrete responsibility for managing requirements of the auth lifecycle.

*Note: The following functions are controlled fully by the front-end developer. The choice of whether to use the AppProvider is completely up to them. Authentication and authorization can still be implimented using custom logic and components.*

##### authorize
Load's the specified authentication page for the external provider.
```javascript
function authorize() {
  window.location.href = encodeURI(`${IBM_APP_ID_OAUTH_URL}/authorization?client_id=${IBM_APP_ID_CLIENT_ID}&scope=openid&response_type=code&redirect_uri=http://localhost:3000/auth`);
}
```

##### logout
Reloads application at root path.
```javascript
function logout() {
  window.location.href = '/';
}
```

##### getState
Fetches the current auth state from the browsers `localStorage` object.

##### setState
Updates the auth state in `localStorage` by merging it with an updated auth payload. 

##### purgeState
Delete auth state persisted in local storage while optionally forcing logout redirect.

##### checkIsAuthorized
Determines whether the current user is authorized based the existence of a token in `localStorage`.
