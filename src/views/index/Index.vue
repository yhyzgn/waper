<template>
  <div class="dv-container-index">
    <el-container>
      <el-aside>
        <div class="no-select dv-title-logo">
          <img class="logo" src="/src/assets/img/logo.png" alt="Logo"/>
          <h1 class="title">waper</h1>
        </div>

        <div class="dv-menu">
          <el-menu
              :default-active="active"
              class="no-select"
              @select="handleMenuSelected">
            <el-menu-item-group v-for="gp in menuGroup" :key="gp.name" :title="gp.name">
              <template v-for="menu in gp.menus" :key="menu.code">
                <template v-if="!!menu.children && menu.children.length > 0">
                  <el-sub-menu :index="menu.code">
                    <template #title>
                      <icon :name="menu.icon"/>
                      <span>{{ menu.name }}</span>
                    </template>

                    <template v-for="sub in menu.children" :key="sub.code">
                      <template v-if="!!sub.children && sub.children.length > 0">
                        <el-sub-menu :index="sub.code">
                          <template #title>
                            <icon :name="sub.icon"/>
                            <span>{{ sub.name }}</span>
                          </template>

                          <template v-for="item in sub.children" :key="sub.code">
                            <template v-if="item.hasChildren">
                              <el-sub-menu :index="item.code">
                                <template #title>
                                  <icon :name="item.icon"/>
                                  <span>{{ item.name }}</span>
                                </template>
                                <el-menu-item v-for="child in item.children" :key="child.name" :index="child.code">{{ child.name }}</el-menu-item>
                              </el-sub-menu>
                            </template>
                            <template v-else>
                              <el-menu-item :index="item.code">
                                <icon :name="item.icon"/>
                                <template #title>{{ item.name }}</template>
                              </el-menu-item>
                            </template>
                          </template>

                        </el-sub-menu>
                      </template>
                      <template v-else>
                        <el-menu-item :index="sub.code">
                          <icon :name="sub.icon"/>
                          <template #title>{{ sub.name }}</template>
                        </el-menu-item>
                      </template>
                    </template>

                  </el-sub-menu>
                </template>
                <template v-else>
                  <el-menu-item :index="menu.code">
                    <icon :name="menu.icon"/>
                    <template #title>{{ menu.name }}</template>
                  </el-menu-item>
                </template>
              </template>
            </el-menu-item-group>
          </el-menu>
        </div>
      </el-aside>

      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {ipcRenderer} from 'electron'
import {toast} from '@/toast'

const route = useRoute()
const router = useRouter()

const menuGroup = [
  {
    name: '??????',
    menus: [
      {
        code: 'wl-online',
        icon: 'Cloudy',
        name: '????????????'
      },
      {
        code: 'wl-collection',
        icon: 'Collection',
        name: '?????????'
      },
      {
        code: 'wl-local',
        icon: 'FolderChecked',
        name: '????????????'
      },
      {
        code: 'wl-download',
        icon: 'Download',
        name: '????????????'
      }
    ]
  },
  {
    name: '??????',
    menus: [
      {
        code: 'mr-setting',
        icon: 'Setting',
        name: '??????'
      },
      {
        code: 'mr-about',
        icon: 'Paperclip',
        name: '??????'
      }
    ]
  }
]

// ???????????????
const activeOnStart = route.name
let active = $ref(activeOnStart)

const handleMenuSelected = (index, indexPath, item, routerResult) => {
  const menu = findMenuByCode(index)
  if (!menu) {
    toast.error('?????????????????????')
    return
  }

  // ????????????
  replacePage(menu)

  // ?????????????????????
  ipcRenderer.send('menu-selected', Object.assign({}, menu))
}

const replacePage = menu => {
  router.replace({name: menu.code})
}

const findMenuByCode = code => {
  let menu = null
  for (let mg of menuGroup) {
    for (let mn of mg.menus) {
      if (mn.code === code) {
        menu = mn
        break
      }
    }
  }
  return menu
}

const updateMenuByRoute = () => {
  const route = useRoute()
  const menu = findMenuByCode(route.name)
  if (!menu) {
    toast.error('?????????????????????')
    return
  }

  // ??????
  active = menu.code

  // ?????????????????????
  ipcRenderer.send('menu-selected', Object.assign({}, menu))
}

onUpdated(() => {
  updateMenuByRoute()
})

onMounted(() => {
  updateMenuByRoute()
})
</script>

<style lang="scss">
.dv-container-index {
  width: 100vw;

  .el-container {
    height: 100vh;

    .el-aside {
      width: 14%;
      min-width: 220px;
      border-right: 1px solid $dividerColor;

      .el-menu {
        border-right: none;
        background-color: transparent !important;

        .el-menu-item-group__title {
          text-align: left;
          font-size: .8em;
          padding-left: 30px !important;
          margin-top: 16px;
        }

        .i-icon-menu {
          font-size: 1rem;
          margin-right: 12px;
        }

        .el-sub-menu__title, .el-menu-item {
          font-size: .8rem;
          padding-left: 52px !important;
          height: 40px;
          line-height: 100%;
        }

        .el-menu-item * {
          vertical-align: 0;
          color: $fontPrimaryColor;
        }

        .el-menu-item, .el-sub-menu__title {
          text-align: left;
          color: $fontPrimaryColor;
        }

        .el-menu-item:hover, .el-sub-menu__title:hover {
          background-color: $blackAlphaColor;
        }

        .el-menu-item.is-active {
          background: $primaryAccent !important;
        }

        .el-sub-menu .el-menu-item {
          font-size: .6rem;
          padding-left: 36px !important;
        }
      }

      .el-menu:not(.el-menu--collapse) {
        width: 100%;
      }
    }

    .el-main {
      padding: 0 !important;
    }
  }
}
</style>

<style scoped lang="scss">
.dv-container-index {
  .el-container {
    .el-aside {
      .dv-title-logo {
        margin: 56px 0 44px 0;

        img.logo {
          width: 88px;
          height: 88px;
          margin-bottom: 12px;
        }

        .title {
          color: $fontPrimaryColor;
        }
      }
    }
  }
}
</style>
