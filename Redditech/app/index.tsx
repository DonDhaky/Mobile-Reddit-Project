import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button } from "react-native";
import { Box, ScrollView } from "@gluestack-ui/themed";
// import { dotenv } from 'react-native';
import { Text, View, SafeAreaView, Image } from "react-native";

const Header = () => {
  return (
    <View style={{ alignItems: "center", padding: 0, margin: 0, height: 60 }}>
      <Text style={{ color: "white", fontSize: 24 }}>Redditech</Text>
    </View>
  );
};

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.reddit.com/api/v1/authorize.compact",
  tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
};

// const CLIENT_ID = process.env.CLIENT_ID
// const REDIRECT_URI = process.env.REDIRECT_URI

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "Fi4iae9bhuNyqVHnL5enog",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        native: "exp://nl2rzzo-anonymous-8081.exp.direct",
      }),
    },
    discovery
  );


  const [userTitle, setUserTitle] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [myArray, setUserIcon] = React.useState("");


  React.useEffect(() => {
    if (response?.type === "success") {
      const clientId = "Fi4iae9bhuNyqVHnL5enog";
      const { code: code_code } = response.params;
      console.log("Oauth Access Code:", code_code);
      const redirectUri = "exp://nl2rzzo-anonymous-8081.exp.direct";

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

          setUsername(username);
          setUserTitle(usertitle);
          setUserIcon(myArray[0]);

          // Set the user data to state or context for further use
        });
    }
  }, [response]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
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
            {userTitle ? `Username: ${username}` : null}
          </Text>

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
