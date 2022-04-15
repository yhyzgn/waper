<template>
  <div class="dv-online-container">
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
            placeholder="Search..."
            @keyup.enter.native="handleSearch">
            <template #suffix>
              <el-button icon="Search" :loading="searching" @click="handleSearch"/>
            </template>
          </el-input>
        </div>

        <div class="dv-count">共 {{ total }} 张</div>
      </div>
    </div>

    <div class="dv-online-main-container" ref="refImgContainer" v-infinite-scroll="loadPage" infinite-scroll-delay="600" infinite-scroll-distance="100">
      <paper class="pp-item" v-for="pp in papers" :key="pp.id"
             :src="pp.thumbs.small"
             :resolution="pp.resolution"
             :size="pp.file_size"
             :scrollContainer="refImgContainer"/>
    </div>
  </div>
</template>

<script setup>
import {useSettings} from '@/store'
import {toast} from '@/toast'
import {get} from '@/api/request'

// 加载配置文件信息
const storeSettings = useSettings()
const settings = storeSettings.settings

// nsfw
const purityNsfw = {
  code: 'nsfw',
  label: 'NSFW',
}

const categories = [
  {
    code: 'general',
    label: '常用',
  },
  {
    code: 'anime',
    label: '动漫',
  },
  {
    code: 'people',
    label: '人物',
  },
]
const purities = $ref([
  {
    code: 'sfw',
    label: 'SFW',
  },
  {
    code: 'sketchy',
    label: 'Sketchy',
  },
])
const resolutions = [
  {
    code: '0',
    label: '不限',
  },
  {
    code: '1280x720',
    label: '720+',
  },
  {
    code: '1920x1080',
    label: '1080+',
  },
  {
    code: '2560x1080',
    label: '2K+',
  },
  {
    code: '3840x2160',
    label: '4k+',
  },
  {
    code: '7680x4320',
    label: '4K+',
  },
]
const sorts = [
  {
    code: 'date_added',
    label: '最新',
  },
  {
    code: 'relevance',
    label: '相关度',
  },
  {
    code: 'random',
    label: '随机',
  },
  {
    code: 'views',
    label: '浏览数',
  },
  {
    code: 'favorites',
    label: '收藏数',
  },
  {
    code: 'hot',
    label: '热度',
  },
  {
    code: 'toplist',
    label: '热门列表',
  },
]

if (settings && settings.apiKey) {
  purities.push(purityNsfw)
}

let mdlCategory = $ref(['general'])
let mdlPurity = $ref(['sfw', 'sketchy'])
let mdlResolution = $ref('0')
let mdlSort = $ref('date_added')
let mdlKeyword = $ref('')
let total = $ref(0)
let searching = $ref(true)

const refImgContainer = $ref(null)

let page = $ref(1)
let papers = $ref([])

// 下一页的数据暂存
let preparedPapers = []

const handleSearch = () => {
  page = 1
  search()
}

const loadPage = () => {
  page++
  search()
}

const transformOptions = (options, checked, destLength) => {
  const result = options.map(opt => checked.indexOf(opt.code) > -1 ? 1 : 0)
  // 自动填充 0 到末尾
  if (destLength && destLength > 0 && options.length < destLength && result.length < destLength) {
    result.push(...Array(destLength - result.length).fill(0))
  }
  return result.join('')
}

const search = () => {
  searching = true

  const params = {
    page: page,
    categories: transformOptions(categories, mdlCategory),
    purity: transformOptions(purities, mdlPurity, 3),
    atleast: mdlResolution !== '0' || undefined,
    sorting: mdlSort,
    q: mdlKeyword,
  }

  // 当加载第一页后需要立刻把第二页的数据也准备一下
  // 当 page >= 2 时，只从 preparedPapers 中获取数据，然后再把下一页的准备好
  if (page === 1) {
    get('/search', params).then(data => {
      total = data.meta.total
      papers.splice(0, papers.length)
      papers.push(...data.data)

      scrollToTop()

      // 把第 2 页的数据准备一下
      prepareNextPage(params)
    }).catch(err => {
      toast.error(err)
    }).finally(() => {
      searching = false
    })
  } else {
    // 直接从已准备好的数据中取得
    papers.push(...preparedPapers)
    searching = false

    // 然后每次都把下一页的再准备好
    prepareNextPage(params)
  }
}

const prepareNextPage = params => {
  // 下一页
  params.page++

  preparedPapers = []
  get('/search', params).then(data => {
    preparedPapers = data.data
  }).catch(err => {
    toast.error(err)
  })
}

const init = async () => {
  await search()
}

const scrollToTop = () => {
  if (refImgContainer.scrollTop) {
    window.requestAnimationFrame(scrollToTop)
    refImgContainer.scrollTo(0, 0)
  }
}

init()
</script>

<style scoped lang="scss">
.dv-online-container {
  display: flex;
  flex-direction: column;
  height: 100vh;

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

  .dv-online-main-container {
    padding: 12px 16px;
    display: inline-grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 12px;
    row-gap: 12px;
    justify-items: start;
    align-items: start;
    overflow: auto;

    .pp-item {
    }
  }
}
</style>
