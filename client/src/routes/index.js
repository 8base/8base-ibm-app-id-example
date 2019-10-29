import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { useAuth } from '8base-react-sdk';

import { ProtectedRoute } from '../ProtectedRoute';
import { Auth } from './auth';
import { Public } from './public';
import { Protected } from './protected';

const Routes = () => {
  const { isAuthorized, authClient } = useAuth();

  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route>
        <Link to="/public">Public</Link>
        { isAuthorized && <Link to="/protected">Protected</Link> }
        {
          isAuthorized
          ?
          <button type="button" onClick={() => authClient.logout()}>Logout</button>
          :
          <button type="button" onClick={() => authClient.authorize()}>Login</button>
        }
        <Switch>
          <Route path="/public" component={Public} />
          <ProtectedRoute path="/protected" component={Protected} />
          <Redirect to="/public" />
        </Switch>
      </Route>
    </Switch>
  );
};

export { Routes };
