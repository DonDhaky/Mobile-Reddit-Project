import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button } from 'react-native';
import { Box, ScrollView } from '@gluestack-ui/themed';
import { dotenv } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.reddit.com/api/v1/authorize.compact',
  tokenEndpoint: 'https://www.reddit.com/api/v1/access_token',
};

// const CLIENT_ID = process.env.CLIENT_ID
// const REDIRECT_URI = process.env.REDIRECT_URI

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'xCC8ps1LpPrNelUlJzEMAw',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        native: "exp://pilavjk-anonymous-8082.exp.direct",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <ScrollView>
    <Box marginTop="50%">
    <Button
      disabled={!request}
      title="Login with Reddit"
      onPress={() => {
        promptAsync();
      }}
    />
    </Box>
    </ScrollView>
  );
}