import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button } from "react-native";
import { Box, ScrollView, Textarea } from "@gluestack-ui/themed";
// import { dotenv } from 'react-native';
import { Text, View, SafeAreaView, Image } from "react-native";
import AppHeader from "@/components/AppHeader";
import { TextInput } from "react-native";
import { router } from 'expo-router'
import { CLIENT_ID, REDIRECT_URI } from "@env";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.reddit.com/api/v1/authorize.compact",
  tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
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


  const [userTitle, setUserTitle] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [myArray, setUserIcon] = React.useState("");
  const [Description, setUserdescription] = React.useState("");


  React.useEffect(() => {
    if (response?.type === "success") {
      const clientId = CLIENT_ID;
      const { code: code_code } = response.params;
      console.log("Oauth Access Code:", code_code);
      const redirectUri = REDIRECT_URI;

      fetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(clientId + ":"),
        },
        body: `grant_type=authorization_code&code=${code_code}&redirect_uri=${redirectUri}`,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const accessToken = data.access_token;
          console.log("Access Token:", accessToken);
          // Fetch user data
          return fetch("https://oauth.reddit.com/api/v1/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        })
        .then((userRes) => {
          return userRes.json();
        })
        .then((userData) => {
          console.log("User data:", userData);
          const username = userData.name;
          console.log("Username: ", username);
          const usertitle = userData.subreddit.title;
          console.log("Title: ", usertitle);
          const userIcon = userData.icon_img;
          const myArray = userIcon.split('?');
          console.log("Icon", userIcon);
          const Description = userData.subreddit.public_description; 
          console.log('Description User :', Description);

          setUsername(username);
          setUserTitle(usertitle);
          setUserdescription(Description);

          // Check if the Url is not empty, pourquoi corriger l'erreur de url vide
          if (myArray[0]) {
            setUserIcon(myArray[0]);
          }
          else {
            console.log("User icon Url est vide pelo c'est la merde");
          }

        });
   // if (response?.type === 'success') {
     // const { code } = response.params;
     // console.log(code);
     // console.log(response);
     // router.push('/tabs');
    }
  }, [response]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
      <ScrollView>
        <AppHeader />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={{
              uri: myArray.length > 0 ? myArray : 'Justinlemeilleurquinousmanqueterriblement!',
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
            }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 18,
              height: 40,
              fontWeight: 600,
              textDecorationLine: "underline",
            }}
          >
            {userTitle ? "Title" : null}
          </Text>
          <Text style={{ color: "white", fontSize: 18, height: 40 }}>
            {userTitle ? `Title: ${userTitle}` : "Log in Please"}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              height: 40,
              fontWeight: 600,
              textDecorationLine: "underline",
            }}
          >
            {userTitle ? "Username" : null}
          </Text>
          <Text style={{ color: "white", fontSize: 18, height: 40 }}>
            {userTitle ? username : null}
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 18,
              height: 40,
              fontWeight: 600,
              textDecorationLine: "underline",
            }}
          >
            {userTitle ? "Description" : null}
          </Text>

          <TextInput multiline={true} style={{ color: "white", fontSize: 18, height: 60, overflow: "visible" }}>
            {Description ? Description : null}

          </TextInput>
          <Button
            disabled={!request}
            title="Login with Reddit"
            onPress={() => {
              promptAsync();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
        
   // <View>
   // <Box marginTop="50%">
   // <Button
     // disabled={!request}
     // title="Login"
     // onPress={() => {
       // promptAsync();
     // }}
   // />
   // </Box>
   // </View>

  );
}
