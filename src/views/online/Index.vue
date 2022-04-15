<template>
  <div class="dv-header-container">
    <div class="dv-header-content">
      <div class="dv-ops">
        <el-checkbox-group class="tag-grp-ops" v-model="mdlCategory">
          <el-checkbox-button v-for="ctg in categories" :key="ctg.code" :label="ctg.code">
            {{ ctg.label }}
          </el-checkbox-button>
        </el-checkbox-group>

        <el-checkbox-group class="tag-grp-ops" v-model="mdlPurity">
          <el-checkbox-button v-for="prt in purities" :key="prt.code" :label="prt.code">
            {{ prt.label }}
          </el-checkbox-button>
        </el-checkbox-group>

        <el-select v-model="mdlResolution" class="tag-grp-ops tag-select" placeholder="分辨率">
          <el-option
              v-for="rls in resolutions"
              :key="rls.code"
              :label="rls.label"
              :value="rls.code"/>
        </el-select>

        <el-select v-model="mdlSort" class="tag-grp-ops tag-select" placeholder="排序">
          <el-option
              v-for="st in sorts"
              :key="st.code"
              :label="st.label"
              :value="st.code"/>
        </el-select>

        <el-input
            v-model="mdlKeyword"
            class="tag-grp-ops tag-ipt"
            placeholder="Search...">
          <template #suffix>
            <icon name="Search" class="icn-search" @click="handleSearch"/>
          </template>
        </el-input>
      </div>

      <div class="dv-count">共 {{ total }} 张</div>
    </div>
  </div>
</template>

<script setup>
import {useSettings} from '@/store'
import {toast} from '@/toast'

// 加载配置文件信息
const storeSettings = useSettings()

const purityNsfw = {
  code: 'nsfw',
  label: 'NSFW'
}

const categories = [
  {
    code: 'general',
    label: '常用'
  },
  {
    code: 'anime',
    label: '动漫'
  },
  {
    code: 'people',
    label: '人物'
  }
]
const purities = ref([
  {
    code: 'sfw',
    label: 'SFW'
  },
  {
    code: 'sketchy',
    label: 'Sketchy'
  }
])
const resolutions = [
  {
    code: '0',
    label: '不限'
  },
  {
    code: '1280x720',
    label: '720+'
  },
  {
    code: '1920x1080',
    label: '1080+'
  },
  {
    code: '2560x1080',
    label: '2K+'
  },
  {
    code: '3840x2160',
    label: '4k+'
  },
  {
    code: '7680x4320',
    label: '4K+'
  }
]
const sorts = [
  {
    code: 'date_added',
    label: '最新'
  },
  {
    code: 'relevance',
    label: '相关度'
  },
  {
    code: 'random',
    label: '随机'
  },
  {
    code: 'views',
    label: '浏览数'
  },
  {
    code: 'favorites',
    label: '收藏数'
  },
  {
    code: 'hot',
    label: '热度'
  },
  {
    code: 'toplist',
    label: '热门列表'
  }
]

const settings = storeSettings.settings

if (settings && settings.apiKey) {
  purities.value.push(purityNsfw)
}

const mdlCategory = ref([])
const mdlPurity = ref([])
const mdlResolution = ref('0')
const mdlSort = ref('date_added')
const mdlKeyword = ref('')
const total = ref(0)

const handleSearch = () => {
  // settings.apiKey = 'fbfbhGpJ3BYj9RHMWmFtSMXvphzp2ofK'
  // storeSettings.save(settings)

  fetch('https://wallhaven.cc/api/v1/search', {
    method: 'get',
    headers: {'Content-type': 'application/json'}
  }).then(data => {
    console.log(data)
  }).catch(err => {
    toast.error(err)
  })
}
</script>

<style scoped lang="scss">
.dv-header-container {
  padding: 40px 16px 12px;
  border-bottom: 1px solid $dividerColor;

  .dv-header-content {
    display: flex;
    flex-direction: row;

    .dv-ops {
      flex: 1;
      display: inline-flex;

      .tag-grp-ops + .tag-grp-ops {
        margin-left: 12px;
      }

      .tag-select {
        width: 100px;
      }

      .tag-ipt {
        width: 300px;

        .icn-search:hover {
          cursor: pointer;
        }
      }
    }

    .dv-count {
      font-size: .76em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
