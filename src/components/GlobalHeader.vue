<template>
  <div id="globalHeader">
    <!-- 取消自動換行 :wrap="false" -->
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.jpg" alt="logo" />
            <div class="title"> TuTu Cloud </div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto"> <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items"
          @click="doMenuClick" /> </a-col>

      <!-- 用户信息展示 -->
      <a-col flex="150px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <div class="dropdown-wrap">
              <a-dropdown-button @click="handleButtonClick">
                <a-space>
                  {{ loginUserStore.loginUser.userName ?? 'Anonymous' }}
                </a-space>
                <template #overlay>
                  <a-menu @click="doLogout">
                    <a-menu-item key="1">
                      <LoginOutlined />
                      Sign out
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown-button>
            </div>
            <!-- 用户头像 暂时不用
            <a-avatar :src="loginUserStore.loginUser.userAvatar" /> -->
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">Sign in</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons-vue';
import { MenuProps, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useLoginUserStore } from '@/stores/useLoginUserStore';
import { userLogoutUsingPost } from '@/api/userController';
const handleButtonClick = (e: Event) => {
  console.log('click left button', e);
};
const handleMenuClick: MenuProps['onClick'] = e => {
  console.log('click', e);
};

const loginUserStore = useLoginUserStore();

const originItems = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: 'Home',
    title: 'Home',
  },
  {
    key: '/admin/userManage',
    label: 'UserManage',
    title: 'UserManage',
  },
  {
    key: 'other',
    label: h('a', { href: 'https://www.google.com/', target: '_blank' }, 'Google Search'),
    title: 'Google Search',
  }
]);
// 过滤导航栏
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    // Ensure menu.key is a string before using startsWith
    const keyAsString = String(menu?.key);
    if (keyAsString.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser;
      if (!loginUser || loginUser.userRole !== "admin") {
        return false;
      }
    }
    return true;
  });
};
// 展示在导航栏的路由数组
const items = computed<MenuProps['items']>(() => filterMenus(originItems.value))



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

// 用户登出
const doLogout = async () => {
  const resp = await userLogoutUsingPost();
  if (resp.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: "Guest",
    });
    message.success("logout success!");
    router.push(
      {
        path: "/",
      }
    );
  } else {
    message.error(`logout failed, ${resp.data.message}`);
  }
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

.dropdown-wrap :deep(.ant-dropdown-button) {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
