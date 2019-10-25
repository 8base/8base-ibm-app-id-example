import React, { useEffect, useState } from 'react';
import { gql, useAuth } from '8base-react-sdk';
import { compose, withApollo } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import qs from 'qs';

const AUTH_PROFILE_ID = 'cjyob0tyl00o601joamqx199q';

const GET_TOKEN_MUTATION = gql`
  mutation GetToken($code: String!, $authProfileId: ID!) {
    getToken(code: $code, authProfileId: $authProfileId) {
      token
    }
  }
`;

let Auth = ({ client }) => {
  const [authorising, setAuthorizing] = useState(true);
  const { authClient } = useAuth();

  useEffect(() => {
    if (document.location.search.includes('code')) {
      const authorize = async () => {
        const { code } = qs.parse(document.location.search.slice(1));

        const tokenResponse = await client.mutate({ mutation: GET_TOKEN_MUTATION, variables: { code, authProfileId: AUTH_PROFILE_ID }})

        const token = tokenResponse.data.getToken.token;

        await authClient.setState({
          token,
        });

        setAuthorizing(false);
      };

      authorize();
    } else {
      authClient.authorize();

      setAuthorizing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return authorising ? null : <Redirect to="/" />;
};

Auth = compose(withApollo)(Auth);

export { Auth };
