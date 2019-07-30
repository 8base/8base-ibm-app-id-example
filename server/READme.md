# 8base OpenID Server Setup

**8base** supports connecting to an external authentication provider that supports the OpenID specification for *Professional* and *Enterprise* plans. To use this feature, there is some light setup required in the Managment Console and a custom *resolver* function that should be deployed to your project's workspace.

### getToken Resolver

In the `openid-app/server/src` directory we've declared the *getToken* mutation, along with the *TokenResult* response type. 

In the *getToken* function, the relevant environment variables are being accessed - as they are set in the Management Console - to provide the required credentials and configurations. A request is then made to the authentication provider, the authenticating user queried from the database - or created when not found - and token returned.