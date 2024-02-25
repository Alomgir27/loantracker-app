import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="loansScheme" />
      <Stack.Screen name="loansStatement" />
      <Stack.Screen name="openingAccounts" />
      <Stack.Screen name="[user]" />
      <Stack.Screen name="loansPayment" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="applyLoan" />
      <Stack.Screen name="(loan)/[loanId]" />
    </Stack>
  );
}
