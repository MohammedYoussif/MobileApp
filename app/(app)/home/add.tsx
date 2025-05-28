import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View
} from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const {  bottom } = useSafeAreaInsets();
  const { navigate } = useRouter();
  const { userProfile } = useAuth();

  return (
      <View style={[styles.container, { paddingBottom: bottom }]}>
        <QRCode
          value={`https://bexpo.xyz/${userProfile?.accountType}/${userProfile?.id}?add=true`}
          color="#B38051"
          size={225}
        />

      <ThemedText type="medium" style={styles.name}>{userProfile?.accountType === 'business'? userProfile?.companyName : userProfile?.fullName}</ThemedText>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
     alignItems: 'center',
     justifyContent: 'center'
  },
  name: {
    fontSize: 20,
    marginTop: 10,
    color: "#7D7E79",
  }
});
