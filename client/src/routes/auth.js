import React, { useEffect, useState } from 'react';
import { withAuth } from '@8base/react-sdk';
import { compose, withApollo } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import qs from 'qs';

let Auth = ({ auth, client }) => {
  const [authorising, setAuthorizing] = useState(true);

  useEffect(() => {
    if (document.location.search.includes('token')) {
      const authorize = async () => {
        const { token } = qs.parse(document.location.search.slice(1));

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
