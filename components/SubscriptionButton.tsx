import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  ios: ["BusinessYearly"],
  android: ["expo_yearly_plan"],
});

// Define types for component props
interface SubscriptionButtonProps {
  onSubscribe?: (purchase: RNIap.Purchase) => void;
  offerButtonTitle?: string;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  onSubscribe,
  offerButtonTitle = "Subscribe with Special Offer",
}) => {
  const [products, setProducts] = useState<RNIap.Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [fetchingProducts, setFetchingProducts] = useState<boolean>(true);

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
      setFetchingProducts(true);
      if (!subscriptionIds) {
        console.log("No subscription IDs available for this platform");
        return;
      }

      const result = await RNIap.getSubscriptions({ skus: subscriptionIds });
      setProducts(result);
      console.log("Available products:", result);
    } catch (error) {
      console.log("Error fetching products", error);
    } finally {
      setFetchingProducts(false);
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

  // Request a subscription with promotional offer
  const requestSubscriptionWithOffer = async (
    productId?: string
  ): Promise<void> => {
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

      // Use provided productId or default to first product
      const sku = productId || subscriptionIds[0];

      if (!sku) {
        Alert.alert("Error", "Subscription product not available");
        setLoading(false);
        return;
      }
      const offerToken = (products[0] as any).subscriptionOfferDetails.find(
        (e: any) => e.offerId !== null
      ).offerToken;

      await RNIap.requestSubscription({
        sku,
        subscriptionOffers: [
          {
            sku,
            offerToken: offerToken,
          },
        ],
      });

      // Note: The purchase will be handled by the purchaseUpdatedListener
    } catch (error: any) {
      console.log("Subscription with offer error", error);
      if (error.code !== "E_USER_CANCELLED") {
        Alert.alert(
          "Subscription Failed",
          "There was an error processing your subscription with the special offer"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Get price from product safely
  const getProductPrice = (product: RNIap.Subscription): string => {
    if (Platform.OS === "ios") {
      // Handle iOS product
      const iosProduct = product as RNIap.SubscriptionIOS;
      return iosProduct.price || "Price unavailable";
    } else {
      // Handle Android product
      const androidProduct = product as RNIap.SubscriptionAndroid;
      return (
        androidProduct.subscriptionOfferDetails[0].pricingPhases
          .pricingPhaseList[0].formattedPrice || "Price unavailable"
      );
    }
  };

  // Get subscription period safely
  const getSubscriptionPeriod = (product: RNIap.Subscription): string => {
    if (Platform.OS === "android") {
      // Handle Android product
      const androidProduct = product as RNIap.SubscriptionAndroid;
      const period =
        androidProduct.subscriptionOfferDetails[0].pricingPhases
          .pricingPhaseList[0].billingPeriod;

      if (period) {
        if (period.includes("Y"))
          return `${period.replace("P", "").replace("Y", "")} Year`;
        if (period.includes("M"))
          return `${period.replace("P", "").replace("M", "")} Month`;
        if (period.includes("W"))
          return `${period.replace("P", "").replace("W", "")} Week`;
        if (period.includes("D"))
          return `${period.replace("P", "").replace("D", "")} Day`;
      }
    }

    // For iOS or fallback
    if (product.title) {
      if (product.title.toLowerCase().includes("year")) return "Yearly";
      if (product.title.toLowerCase().includes("month")) return "Monthly";
    }

    return "Subscription";
  };

  return (
    <View style={styles.container}>
      {fetchingProducts ? (
        <ActivityIndicator size="large" color="#4285F4" />
      ) : (
        <>
          {products.length > 0 && (
            <View style={styles.productInfo}>
              {products.map((product) => (
                <View key={product.productId} style={styles.productDetails}>
                  <Text style={styles.productTitle}>{product.title}</Text>
                  {product.description && (
                    <Text style={styles.productDescription}>
                      {product.description}
                    </Text>
                  )}
                  <View style={styles.pricingRow}>
                    <Text style={styles.productPrice}>
                      {getProductPrice(product)}
                    </Text>
                    <Text style={styles.productPeriod}>
                      / {getSubscriptionPeriod(product)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              styles.offerButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={() => requestSubscriptionWithOffer(products[0]?.productId)}
            disabled={loading || !connected}
          >
            <Text style={styles.buttonText}>
              {loading ? "Processing..." : offerButtonTitle}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    width: "100%",
  },
  productInfo: {
    width: "100%",
    marginBottom: 16,
  },
  productDetails: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  pricingRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  productPeriod: {
    fontSize: 16,
    color: "#666666",
    marginLeft: 4,
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
    width: "100%",
  },
  offerButton: {
    backgroundColor: "#34A853", // Different color for the offer button
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
