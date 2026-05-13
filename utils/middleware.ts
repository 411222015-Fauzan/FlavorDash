import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

export async function checkAuth() {
  const token = await SecureStore.getItemAsync("token");

  if (!token) {
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      await SecureStore.deleteItemAsync("token");
      return false;
    }

    return true;
  } catch (error) {
    await SecureStore.deleteItemAsync("token");
    return false;
  }
}