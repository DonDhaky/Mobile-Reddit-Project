import EditScreenInfo from "@/components/EditScreenInfo";
import { Heading, Center, Divider, Text } from "@gluestack-ui/themed";

export default function Tab2() {
  return (
    <Center flex={1}>
      <Heading bold size="2xl">
      Redditech - Paramètres
      </Heading>
      <Divider marginVertical={30} width="80%" />
      <Text p="$4">Example below to use gluestack-ui components.</Text>
      <EditScreenInfo path="app/(app)/(tabs)/tab2.tsx" />
    </Center>
  );
}
