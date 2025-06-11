<template>
  <div id="globalHeader">
    <!-- 取消自動換行 :wrap="false" -->
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.jpg" alt="logo" />
            <div class="title"> 雲圖庫 </div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto"> <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items"
          @click="doMenuClick" /> </a-col>
      <a-col flex="100px">
        <div class="user-login-status">
          <a-button type="primary" href="/user/login">登錄</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { HomeOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: 'about',
    label: '关于',
    title: '关于',
  },
  {
    key: 'other',
    label: h('a', { href: 'https://www.google.com/', target: '_blank' }, 'Google一下'),
    title: 'Google一下',
  }
]);

const router = useRouter();

//路由高亮
const current = ref<string[]>([]);
router.afterEach((to, from, next) => {
  current.value = [to.path];
})

//路由跳轉
const doMenuClick = ({ key }: { key: string }) => {
  router.push(
    {
      path: key,
    }
  );
}
</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 20px;
}

.logo {
  width: 35px;
  height: 35px;
  margin-right: 10px;
}
</style>
