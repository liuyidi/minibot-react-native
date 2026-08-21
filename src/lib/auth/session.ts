import { setAppearanceMode } from "@/lib/settings/appearanceConfig";
import { clearAccountInfo } from "@/lib/settings/accountConfig";
import { authClient } from "@/lib/auth/client";
import { clearAuthSession, getStoredAuthSession } from "@/lib/auth/config";
import { clearUserProfile } from "@/lib/settings/userProfileConfig";

/** 清除本机用户相关数据（含 auth token） */
export async function logoutUser(): Promise<void> {
  const session = await getStoredAuthSession();
  if (session?.refreshToken) {
    await authClient.logout(session.refreshToken);
  }

  await Promise.all([
    clearAuthSession(),
    clearUserProfile(),
    clearAccountInfo(),
    setAppearanceMode("system"),
  ]);
}

/** 注销账号：清除全部本地账号数据 */
export async function deleteAccount(): Promise<void> {
  await logoutUser();
}
