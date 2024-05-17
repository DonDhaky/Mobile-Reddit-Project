import { Heading, Center, Divider, Text } from "@gluestack-ui/themed";

export default function Tab1() {
  return (
    <Center flex={1}>
      <Heading bold size="2xl">
        Your informations
      </Heading>
      <Divider marginVertical={30} width="80%" />
       <Text p="$4">Afficher ici le profil d'un user connecté, on peut importer des composants en haut du code et les ajouter ici après les avoir créés dans le dossier "components". Il faut ajouter un bouton de déconnexion.</Text>
    </Center>
  );
}
