import { setAppearanceMode } from "@/lib/settings/appearanceConfig";
import { clearAccountInfo } from "@/lib/settings/accountConfig";
import { logoutUserApi } from "@/lib/auth/api";
import { clearAuthSession, getStoredAuthSession } from "@/lib/auth/config";
import { clearDeepSeekApiKey } from "@/lib/deepseek/config";
import { clearUserProfile } from "@/lib/settings/userProfileConfig";

/** 清除本机用户相关数据（含 auth token） */
export async function logoutUser(): Promise<void> {
  const session = await getStoredAuthSession();
  if (session?.refreshToken) {
    await logoutUserApi(session.refreshToken);
  }

  await Promise.all([
    clearAuthSession(),
    clearUserProfile(),
    clearAccountInfo(),
    clearDeepSeekApiKey(),
    setAppearanceMode("system"),
  ]);
}

/** 注销账号：清除全部本地账号数据 */
export async function deleteAccount(): Promise<void> {
  await logoutUser();
}
