import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "regular" | "bold" | "semiBold" | "medium" | "light";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "regular",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "regular" ? styles.regular : undefined,
        type === "bold" ? styles.bold : undefined,
        type === "semiBold" ? styles.semiBold : undefined,
        type === "medium" ? styles.medium : undefined,
        type === "light" ? styles.light : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  regular: {
    paddingBottom: 5,
    fontFamily: "Cairo-Regular",
  },
  semiBold: {
    paddingBottom: 5,
    fontFamily: "Cairo-SemiBold",
  },
  bold: {
    paddingBottom: 5,
    fontFamily: "Cairo-Bold",
  },
  medium: {
    paddingBottom: 5,
    fontFamily: "Cairo-Medium",
  },
  light: {
    paddingBottom: 5,
    fontFamily: "Cairo-Light",
  },
});
