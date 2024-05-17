import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button } from 'react-native';
import { Box, View } from '@gluestack-ui/themed';
import { router } from 'expo-router'
import { CLIENT_ID, REDIRECT_URI } from "@env";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.reddit.com/api/v1/authorize.compact',
  tokenEndpoint: 'https://www.reddit.com/api/v1/access_token',
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID, /////////////////////////////// récupération des variables d'env grâce à l'import de "@env"
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        native: REDIRECT_URI, 
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log(code);
      console.log(response);
      router.push('/tabs');
    }
  }, [response]);

  return (
    <View>
    <Box marginTop="50%">
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
    </Box>
    </View>
  );
}