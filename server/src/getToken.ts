const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const gql = require('graphql-tag');
const jwtDecode = require('jwt-decode');

const IBM_APP_ID_CLIENT_ID = process.env.IBM_APP_ID_CLIENT_ID;
const IBM_APP_ID_TENANT_ID = process.env.IBM_APP_ID_TENANT_ID;
const IBM_APP_ID_SECRET = process.env.IBM_APP_ID_SECRET;
const IBM_APP_ID_URL = process.env.IBM_APP_ID_URL;
const TOKEN_PATH = '/token';

const CLIENT_REDIRECT_URI = process.env.CLIENT_REDIRECT_URI;

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    user {
      id
      email
    }
  }
`;

const USER_SIGN_UP_MUTATION = gql`
  mutation UserSignUp($user: UserCreateInput!, $authProfileId: ID) {
    userSignUpWithToken(user: $user, authProfileId: $authProfileId) {
      id
      email
    }
  }
`;

export default async (event: any, context: any) => {
  const body = new URLSearchParams();

  body.append('grant_type', 'authorization_code');
  body.append('code', event.data.code);
  body.append('client_id', IBM_APP_ID_CLIENT_ID);
  body.append('redirect_uri', CLIENT_REDIRECT_URI);

  let token;
  let email;

  try {
    let tokenResponse = await fetch(`${IBM_APP_ID_URL}/${IBM_APP_ID_TENANT_ID}/${TOKEN_PATH}`, {
      body,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${IBM_APP_ID_CLIENT_ID}:${IBM_APP_ID_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      method: 'post',
    });

    ({ id_token: token } = await tokenResponse.json());

    try  {
      await context.api.gqlRequest(CURRENT_USER_QUERY, {}, {
        authorization: token,
      });
    } catch (e) {
      ({ email } = jwtDecode(token));

      await context.api.gqlRequest(USER_SIGN_UP_MUTATION, {
        user: {
          email,
        },
        authProfileId: event.data.authProfileId,
      }, {
        authorization: token,
      });
    }
  } catch (e) {
    console.log(e);
    throw Error('Authorization Error');
  }

  return {
    data: {
      token,
    },
  };
};
