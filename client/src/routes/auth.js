import React, { useEffect, useState } from 'react';
import { gql, withAuth } from '@8base/react-sdk';
import { compose, withApollo } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import qs from 'qs';

import { AUTH_PROFILE_ID } from '../authClient';

const GET_TOKEN_MUTATION = gql`
  mutation GetToken($code: String!, $authProfileId: ID!) {
    getToken(code: $code, authProfileId: $authProfileId) {
      token
    }
  }
`;

let Auth = ({ auth, client }) => {
  const [authorising, setAuthorizing] = useState(true);

  useEffect(() => {
    if (document.location.search.includes('code')) {
      const authorize = async () => {
        const { code } = qs.parse(document.location.search.slice(1));

        const tokenResponse = await client.mutate({ mutation: GET_TOKEN_MUTATION, variables: { code, authProfileId: AUTH_PROFILE_ID }})

        const token = tokenResponse.data.getToken.token;

        await auth.setAuthState({
          token,
        });

        setAuthorizing(false);
      };

      authorize();
    } else {
      auth.authorize();

      setAuthorizing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return authorising ? null : <Redirect to="/" />;
};

Auth = compose(withApollo, withAuth)(Auth);

export { Auth };
