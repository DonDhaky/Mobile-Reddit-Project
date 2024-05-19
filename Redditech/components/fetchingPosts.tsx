import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button } from "react-native";
import { Box, ScrollView } from "@gluestack-ui/themed";
import { Text, View, SafeAreaView, Image } from "react-native";
import { CLIENT_ID, REDIRECT_URI } from "@env";
// import { router } from 'expo-router'

const Header = () => {
  return (
    <View style={{ alignItems: "center", padding: 0, margin: 0, height: 10, marginTop : 20, borderRadius: 0 }}>
    </View>
  );
};

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.reddit.com/api/v1/authorize.compact",
  tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
};


export default function fetchingPosts() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        native: REDIRECT_URI,
      }),
    },
    discovery
  );


  const [userTitle, setUserTitle] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [myArray, setUserIcon] = React.useState("");
  const [userDescription, setUserDescription] = React.useState("");


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
          console.log("All user data:", userData);
          const username = userData.name;
          console.log("Username : ", username);
          const usertitle = userData.subreddit.title;
          console.log("Title : ", usertitle);
          const userIcon = userData.icon_img;
          const myArray = userIcon.split('?');
          console.log("Icon", userIcon);
          const userDescription = userData.description;


          setUsername(username);
          setUserTitle(usertitle);
          setUserIcon(myArray[0]);
          setUserDescription(userDescription);
        });
    }
  }, [response]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Header />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={{
              uri: myArray,
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 30
            }}
          />
          <Box style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18, height: 40 }}>
            {userTitle ? `Title : ${userTitle}` : "You are not connected..."}
          </Text>
          <Text style={{ color: "white", fontSize: 18, height: 40 }}>
            {username ? `Username : ${username}` : null}
          </Text>
          <Text style={{ color: "white", fontSize: 18, height: 40 }}>
            {userDescription ? `Description : ${userDescription}` : null}
          </Text>
          </Box>
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
  );
}