import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as RNIap from "react-native-iap";

// Define subscription product IDs
const subscriptionIds = Platform.select<string[]>({
  ios: ["your_ios_subscription_id_yearly"],
  android: ["your_android_subscription_id_yearly"],
});

// Define types for component props
interface SubscriptionButtonProps {
  onSubscribe?: (purchase: RNIap.Purchase) => void;
  buttonTitle?: string;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  onSubscribe,
  buttonTitle = "Subscribe Yearly",
}) => {
  const [products, setProducts] = useState<RNIap.Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);

  // Initialize IAP connection
  useEffect(() => {
    let purchaseUpdateSubscription: any;
    let purchaseErrorSubscription: any;

    const initializeIAP = async (): Promise<void> => {
      try {
        await RNIap.initConnection();
        setConnected(true);
        console.log("IAP connection established");

        // Get subscription products
        fetchProducts();

        // Set up purchase listener
        purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
          (purchase: RNIap.Purchase) => {
            handlePurchase(purchase);
          }
        );

        purchaseErrorSubscription = RNIap.purchaseErrorListener(
          (error: RNIap.PurchaseError) => {
            console.log("Purchase error", error);
            Alert.alert(
              "Purchase Error",
              "There was an error with your purchase. Please try again."
            );
          }
        );
      } catch (error) {
        console.log("Error initializing IAP", error);
        Alert.alert("Error", "Failed to connect to the store");
      }
    };

    initializeIAP();

    // Return the cleanup function directly (not from the async function)
    return () => {
      // Clean up listeners on unmount
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
      // End connection
      RNIap.endConnection();
    };
  }, []);

  // Fetch available products
  const fetchProducts = async (): Promise<void> => {
    try {
      if (!subscriptionIds) {
        console.log("No subscription IDs available for this platform");
        return;
      }

      const result = await RNIap.getSubscriptions({ skus: subscriptionIds });
      setProducts(result);
      console.log("Available products:", result);
    } catch (error) {
      console.log("Error fetching products", error);
    }
  };

  // Handle the purchase
  const handlePurchase = async (purchase: RNIap.Purchase): Promise<void> => {
    // Process the purchase
    try {
      await RNIap.finishTransaction({ purchase });

      // Notify parent component about successful subscription
      if (onSubscribe) {
        onSubscribe(purchase);
      }

      Alert.alert("Success", "Thank you for subscribing!");
    } catch (error) {
      console.log("Error finishing transaction", error);
    }
  };

  // Request a purchase
  const requestSubscription = async (): Promise<void> => {
    if (!connected) {
      Alert.alert("Not connected", "Store connection not established");
      return;
    }

    try {
      setLoading(true);

      // Get the product ID
      if (!subscriptionIds) {
        Alert.alert(
          "Error",
          "No subscription products available for this platform"
        );
        setLoading(false);
        return;
      }

      const productId =
        Platform.OS === "ios" ? subscriptionIds[0] : subscriptionIds[0];

      if (!productId) {
        Alert.alert("Error", "Subscription product not available");
        setLoading(false);
        return;
      }

      // Request subscription purchase
      await RNIap.requestSubscription({ sku: productId });

      // Note: The purchase will be handled by the purchaseUpdatedListener
    } catch (error: any) {
      console.log("Subscription error", error);
      if (error.code !== "E_USER_CANCELLED") {
        Alert.alert(
          "Subscription Failed",
          "There was an error processing your subscription"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={requestSubscription}
        disabled={loading || !connected}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : buttonTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default SubscriptionButton;
