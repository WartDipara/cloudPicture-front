<template>
  <div id="userRegisterPage">
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

      <a-form-item name="checkPassword"
        :rules="[{ required: true, message: 'please input password!' }, { min: 8, message: 'a check password must be at least 8 characters long.' }]">
        <a-input-password v-model:value="formState.checkPassword" placeholder="confirm your password" />
      </a-form-item>

      <div class="tips">
        Already have an account?
        <router-link to="/user/login">Sign in</router-link>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width:100%">Sign up</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { userLoginUsingPost, userRegisterUsingPost } from '@/api/userController';
import router from '@/router';
import { message } from 'ant-design-vue';
import { reactive } from 'vue';

//  接收输入表单数据
const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
});


/**提交表单逻辑
 * @param values
 */
const handleSummit = async (values: API.UserRegisterRequest) => {
  // 校验输入
  if (values.userPassword !== values.checkPassword) {
    message.error('The password and confirm password fields do not match. Please enter the same value in both fields.');
    return;
  }
  const resp = await userRegisterUsingPost(values);
  // 注册成功
  if (resp.data.code === 0 && resp.data.data) {
    message.success('success for register!');
    console.log('Redirecting to login page...');
    router.push({
      path: '/user/login', replace: true
    });
  } else {
    message.error(`register failed, ${resp.data.message}`);
  }
}
</script>

<style scoped>
#userRegisterPage {
  max-width: 360px;
  margin: 0 auto;
}

#userRegisterPage .title {
  text-align: center;
  margin-bottom: 36px;
}

#userRegisterPage .desc {
  color: #bbb;
  margin-bottom: 16px;
  text-align: center;
}

#userRegisterPage .tips {
  text-align: right;
  font-size: 12px;
  color: #bbb;
  margin-bottom: 16px;
}
</style>
