/*
 Copyright 2019 IBM Corp.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const appID = require("ibmcloud-appid");
const { GraphQLClient } = require("graphql-request");
const gql = require("graphql-tag");

const WebAppStrategy = appID.WebAppStrategy;

const app = express();

const API_ENDPOINT_URI = 'https://api.8base.com/cjyo4i5fh01ie01mjf11x8mlm';
const AUTH_PROFILE_ID = 'cjyob0tyl00o601joamqx199q';
const CALLBACK_URL = "/ibm/cloud/appid/callback";

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

const port = process.env.PORT || 3000;

app.use(session({
	secret: "123456",
	resave: true,
	saveUninitialized: true,
	proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());

let webAppStrategy = new WebAppStrategy(getAppIDConfig());
passport.use(webAppStrategy);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {failureRedirect: '/error'}));

app.use("/authenticate", passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.get("/authenticate", async (req, res) => {
	const { accessToken, identityToken, identityTokenPayload } = req.session[WebAppStrategy.AUTH_CONTEXT];

	const graphQLClient = new GraphQLClient(API_ENDPOINT_URI, {
    headers: {
      authorization: `Bearer ${identityToken}`,
    },
  });

	try {
		await graphQLClient.request(CURRENT_USER_QUERY);
	} catch (e) {
		await graphQLClient.request(USER_SIGN_UP_MUTATION, {
			user: {
				email: identityTokenPayload.email,
			},
			authProfileId: AUTH_PROFILE_ID,
		});
	}
  
	res.redirect(`http://localhost:3001/auth?token=${identityToken}`);
});

app.get("/logout", (req, res) => {
	WebAppStrategy.logout(req);
	res.redirect(`http://localhost:3001`);
});

app.get('/error', (req, res) => {
	res.send('Authentication Error');
});

app.listen(port, () => {
	console.log("Listening on http://localhost:" + port);
});

function getAppIDConfig() {
	let config;
	
	try {
		// if running locally we'll have the local config file
		config = require('./localdev-config.json');
	} catch (e) {
		if (process.env.APPID_SERVICE_BINDING) { // if running on Kubernetes this env variable would be defined
			config = JSON.parse(process.env.APPID_SERVICE_BINDING);
			config.redirectUri = process.env.redirectUri;
		} else { // running on CF
			let vcapApplication = JSON.parse(process.env["VCAP_APPLICATION"]);
			return {"redirectUri" : "https://" + vcapApplication["application_uris"][0] + CALLBACK_URL};
		}
	}
	return config;
}