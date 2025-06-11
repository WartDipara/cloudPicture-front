import { getLoginUserUsingGet } from "@/api/userController";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: "Guest",
  });

  /**
   * 获取登录用户信息
   */
  async function fetchLoginUser() {
    const resp = await getLoginUserUsingGet();
    if (resp.data.code === 0 && resp.data.data) {
      loginUser.value = resp.data.data;
    }
  }

  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser;
  }

  return { loginUser, setLoginUser, fetchLoginUser };
});
