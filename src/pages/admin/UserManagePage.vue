<template>
  <div id="userManagePage">
    <!-- 搜索栏 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="Account">
        <a-input v-model:value="searchParams.userAccount" placeholder="enter account" />
      </a-form-item>
      <a-form-item label="UserName">
        <a-input v-model:value="searchParams.userName" placeholder="enter username" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">search</a-button>
      </a-form-item>
    </a-form>

    <!-- 表格 -->
    <a-table :columns="columns" :data-source="dataList" :pagination="paginator" @change="doTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="80" />
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">Admin</a-tag>
          </div>
          <div v-else-if="record.userRole === 'user'">
            <a-tag color="blue">User</a-tag>
          </div>
          <div v-else>
            <a-tag color="gray">Unknown/Guest</a-tag>
          </div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button danger @click="doDelete(record.id)">delete</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { deleteUserUsingPost, listUserVoByPageUsingPost } from '@/api/userController';
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { computed, onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Account',
    dataIndex: 'userAccount',
  },
  {
    title: 'UserName',
    dataIndex: 'userName',
  },
  {
    title: 'Avatar',
    dataIndex: 'userAvatar',
  },
  {
    title: 'UserProfile',
    dataIndex: 'userProfile',
  },
  {
    title: 'Role',
    dataIndex: 'userRole',
  },
  {
    title: 'CreateTime',
    dataIndex: 'createTime',
  },
  {
    title: 'Operation',
    key: 'action',
  },
]

// 定义数据 ref则是整体更新，需要全部值改变才会触发更新，而reactive检测到部分改变就会更新
const dataList = ref<API.UserVO[]>([]);
const total = ref(0);

// 搜索条件
// reactive适合动态数据获取，当内容发生改变时，会自动从新获取数据
const searchParams = reactive<API.UserQueryRequest>(
  {
    current: 1,
    pageSize: 10,
  }
)
//  获取数据
const fetchData = async () => {
  const resp = await listUserVoByPageUsingPost({
    ...searchParams
  });
  if (resp.data.code === 0 && resp.data.data) {
    dataList.value = resp.data.data.records ?? []
    total.value = resp.data.data.total ?? 0
  } else {
    message.error(`fetch data error, ${resp.data.message}`)
  }
}

//分页器参数
const paginator = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: any) => `Total ${total} records`,
  }
})

// 表格变化重新获取用户列表
const doTableChange = (page: any) => {
  searchParams.current = page.current;
  searchParams.pageSize = page.pageSize;
  fetchData();
}

// 获取数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

//  删除用户
const doDelete = async (id: any) => {
  if (!id) return;
  Modal.confirm({
    title: 'Confirm Delete',
    content: 'Are you sure you want to delete this user?',
    okText: 'Accept',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        const res = await deleteUserUsingPost({ id });
        if (res.data.code === 0) {
          message.success('Deleted successfully');
          fetchData(); // Refresh data
        } else {
          message.error('Failed to delete');
        }
      } catch (error) {
        console.log('Deletion failed:', error);
        message.error('Failed to delete');
      }
    },
    onCancel: () => {
      console.log('Deletion canceled');
    },
  });
};

//页面加载时获取一次数据
onMounted(() => {
  fetchData()
})

</script>
