<template>
  <div id="userLoginPage">
    <h2 class="title">TuTu - Costumer Sign in</h2>
    <div class="desc">SMI TUTU Cloud Center</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSummit">
      <a-form-item name="userAccount" :rules="[{ required: true, message: 'please input your username' }]">
        <a-input v-model:value="formState.userAccount" placeholder="enter your username" />
      </a-form-item>

      <a-form-item name="userPassword"
        :rules="[{ required: true, message: 'please input password!' }, { min: 8, message: 'a password must be at least 8 characters long.' }]">
        <a-input-password v-model:value="formState.userPassword" placeholder="enter your password" />
      </a-form-item>

      <div class="tips">
        Not an TuTu member yet?
        <router-link to="/user/register">Sign up</router-link>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width:100%">Sign in</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { userLoginUsingPost } from '@/api/userController';
import router from '@/router';
import { useLoginUserStore } from '@/stores/useLoginUserStore';
import { message } from 'ant-design-vue';
import { reactive } from 'vue';

//  接收输入表单数据
const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
});

const loginUserStore = useLoginUserStore();
/**提交表单逻辑
 * @param values
 */
const handleSummit = async (values: API.UserLoginRequest) => {
  try {
    const resp = await userLoginUsingPost(values);
    if (resp.data.code === 0 && resp.data.data) {
      // 登录成功
      // 获取登录用户信息
      await loginUserStore.fetchLoginUser();
      message.success('sign in success!');
      router.replace(
        {
          path: '/'
        }
      )
    } else {
      message.error('sign in failed' + resp.data.message);
    }
  } catch (e: any) {
    message.error('sign in failed' + e.message);
  }

};
</script>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

#userLoginPage .title {
  text-align: center;
  margin-bottom: 36px;
}

#userLoginPage .desc {
  color: #bbb;
  margin-bottom: 16px;
  text-align: center;
}

#userLoginPage .tips {
  text-align: right;
  font-size: 12px;
  color: #bbb;
  margin-bottom: 16px;
}
</style>
