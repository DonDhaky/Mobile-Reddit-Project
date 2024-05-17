import { Text, Center, Heading, Divider } from "@gluestack-ui/themed";

export default function Home() {
  return (
    <Center flex={1}>
      <Heading bold size="2xl">
        Your feed
      </Heading>
      <Divider marginVertical={30} width="80%" />
      <Text p="$4">Afficher ici les posts d'un user connecté sous form de grid, on peut importe des composants en haut du code et les ajouter ici après les avoir créés dans le dossier "components"</Text>
    </Center>
  );
}
