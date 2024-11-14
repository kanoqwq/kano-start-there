<template>
  <Modal :show="isShow" @close="closeSettings">
    <template #default>
      <Tab @select="(index:number)=>selectedTabItem = index" :tabs="Tabs">
      </Tab>
      <div class="mb-2 setting-content" style="width: 100%">
        <Transition name="swipe">
          <div class="option dark:dark-text" v-if="selectedTabItem == 0">
            <UploadImage @success="closeSettings()"></UploadImage>
          </div>
        </Transition>
        <Transition name="swipe">
          <div
              class="option dark:dark-text text-center"
              v-if="selectedTabItem == 1"
          >
            <!-- 收藏夹管理 -->
            <div class="relative mt-2" style="height: 100px">
              <Favorites :style="{ top: 0 }" :edit-mode="true"></Favorites>
            </div>
            <Button @click="clearFavorite">{{ clearBtnText }}</Button>
          </div>
        </Transition>
        <Transition name="swipe">
          <div
              class="option flex-col justify-center"
              v-if="selectedTabItem == 2"
          >
            <div class="text-center">
              <Switch text="过滤CSDN:" v-model="noCSDN"/>
            </div>
            <div class="dark:dark-text ml-2 mr-2">
              <h2
                  class="mt-5 mb-3 text-center"
                  style="font-size: 22px; font-weight: bold"
              >
                过滤词列表
              </h2>
              <ul
                  style="max-height: 500px; margin: 0 auto"
                  v-if="filterWords.length"
                  class="rounded filterList border-dashed border-2 p-2 pt-1 pb-1 border-pink-200"
              >
                <li
                    v-for="item in filterWords"
                    :key="item"
                    class="m-1 ml-0 filter-item"
                >
                  <span>{{ item }}</span>
                  <svg
                      class="close"
                      aria-hidden="false"
                      @click="removeWord(item)"
                  >
                    <use xlink:href="#icon-close"></use>
                  </svg>
                </li>
              </ul>
              <p v-else class="text-center text-gray-500">暂无数据捏~</p>
              <div class="mt-3 flex justify-center flex-wrap items-center">
                <input
                    class="dark:dark-bg rounded mr-1 input dark:dark-input"
                    type="text"
                    v-model.trim="filterWord"
                />
                <Button @click="addFilterWord">添加</Button>
              </div>
            </div>
          </div>
        </Transition>
        <Transition name="swipe">
          <div class="option dark:dark-text" v-if="selectedTabItem == 3">
            <div class="box">
              <h1 class="title">常规设置</h1>
              <div class="content">
                <div class="flex flex-wrap justify-center">
                  <div class="m-2">
                    <Switch text="启用Live2D：" v-model="l2dEnabled"/>
                  </div>
                  <div class="m-2">
                    <Switch
                        text="搜索框动效："
                        v-model="searchTransitonEnabled"
                    />
                  </div>
                  <div class="m-2">
                    <Switch
                        text="历史记录功能："
                        v-model="searchHistoryEnabled"
                    />
                  </div>
                </div>
                <div class="flex justify-end">
                  <div class="m-2">
                    <Button @click="submit">保存修改</Button>
                  </div>
                </div>
              </div>
            </div>
            <div class="box">
              <h1 class="title">Live2D模型列表</h1>
              <div class="content">
                <div class="m-2">
                  <Live2DSettings></Live2DSettings>
                </div>
              </div>
            </div>
            <div class="box">
              <h1 class="title">备份与恢复</h1>
              <div class="content">
                <div class="m-2 inline-block">
                  <Button @click="importSettings">导入设置</Button>
                </div>
                <input
                    @change="fileInputChange"
                    ref="fileInput"
                    type="file"
                    name=""
                    id=""
                    class="hidden"
                />
                <div class="m-2 inline-block">
                  <Button @click="exportSettings">导出设置</Button>
                </div>
                <div class="m-2 inline-block">
                  <Button @click="isShowConfrim = true">清空并初始化</Button>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="content">
                <div class="m-2 inline-block flex items-center">
                  <span class="flex-1"
                  >Page based on Vue.js. created By:<a
                      style="color: deepskyblue !important"
                      href="https://kanokano.cn"
                      target="_blank"
                  >@MiniKano</a
                  ></span
                  >
                  <a
                      href="https://github.com/kanoqwq/kano-start-there"
                      target="_blank"
                  ><i
                      class="iconfont icon-github m-2"
                      style="font-size: 40px"
                  ></i
                  ></a>
                  <a href="https://space.bilibili.com/13479749" target="_blank"
                  ><i
                      class="iconfont icon-bilibili-line m-2"
                      style="font-size: 40px"
                  ></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </template>
  </Modal>
  <Modal :show="isShowConfrim" @close="isShowConfrim = false" animation="scale">
    <div class="confirm">
      <h1 class="dark:dark-text">确认清空所有设置?</h1>
      <div class="options">
        <button
            class="rounded dark:dark-btn p-2 bg-stone-300 transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            @click="reset()"
        >
          确认
        </button>
        <button
            class="rounded dark:dark-btn p-2 bg-stone-300 transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            @click="isShowConfrim = false"
        >
          取消
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/Modal/index.vue";
import {computed, ref, toRaw, watch} from "vue";
import useStore from "@/store";
import {Toast} from "./Toast/index";
import Switch from "./Switsh/Switch.vue";
import Button from "./Button/Button.vue";
import Tab from "./Tab/Tab.vue";
import Favorites from "@/components/Favorites/Favorites.vue";
import UploadImage from "@/components/UploadImage/UploadImage.vue";
import {useImportConfigs} from "@/hooks/useImportConfigs";
import Live2DSettings from "@/components/Live2D/Live2DSettings.vue";

const Configs = useStore.Configs();
const HistorySearch = useStore.historySearch();
const l2dEnabled = ref(Configs.live2dEnabled);
const searchHistoryEnabled = ref(Configs.searchHistoryIsEnabled)
const searchTransitonEnabled = ref(Configs.searchTransitonEnabled);
const Tabs = ref(["背景", "收藏", "滤词", "更多"]);
//tab栏当前选择的项目编号（从0开始）
const selectedTabItem = ref(0);
const isShow = ref(false);
const noCSDN = ref(Configs.filterWords.indexOf("site:csdn.net") !== -1);
const filterWords = computed(() => Configs.filterWords);
const filterWord = ref("");


const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: "close"): void;
}>();

//侦听prop
watch(
    () => props.show,
    () => {
      isShow.value = props.show;
    }
);

watch(filterWords, (words) => {
  const hasValue = words.indexOf("site:csdn.net") !== -1;
  if (hasValue) {
    noCSDN.value = true;
  } else {
    noCSDN.value = false;
  }
});

watch(noCSDN, (nValue) => {
  Configs.removeFilterWord("site:csdn.net");
  if (nValue) {
    Configs.setFilterWord("site:csdn.net");
  }
});
//删除过滤词
const removeWord = (word: string) => {
  Configs.removeFilterWord(word);
};

//添加过滤词
const addFilterWord = () => {
  if (filterWord.value) {
    const res = Configs.setFilterWord(filterWord.value);
    if (!res) {
      Toast({
        value: `关键词已存在！`,
        color: "yellow",
        duration: 2000,
        background: "#00000099",
      });
      return;
    }
  }
  filterWord.value = "";
};

//关闭settings
const closeSettings = () => {
  isShow.value = false;
  emit("close");
};

//初始化
const reset = () => {
  isShowConfrim.value = false;
  Configs.reset();
  Toast({
    value: `重置成功！1秒后自动刷新页面！`,
    color: "green",
    duration: 1000,
    background: "#00000099",
    success() {
      location.reload();
    },
  });
};

const isShowConfrim = ref(false);
//提交修改
const submit = () => {
  l2dEnabled.value ? Configs.toggleLive2d(true) : Configs.toggleLive2d(false);
  searchTransitonEnabled.value
      ? Configs.toggleSearchTransiton(true)
      : Configs.toggleSearchTransiton(false);
  searchHistoryEnabled.value
      ? Configs.toggleSearchHistory(true)
      : Configs.toggleSearchHistory(false);
  Toast({
    value: `保存成功！1秒后自动刷新页面！`,
    color: "green",
    duration: 1000,
    background: "#00000099",
    success() {
      location.reload();
    },
  });
};

const clearBtnText = ref("清空收藏夹");
const clearable = ref(false);
let timer: any = null;
//清空收藏夹
const clearFavorite = () => {
  clearBtnText.value = "确认清空？";
  timer && clearTimeout(timer);
  if (clearable.value) {
    Configs.clearFavLink();
    emit("close");
    Toast({
      value: `操作成功！`,
      color: "green",
      duration: 1000,
      background: "#00000099",
    });
    clearable.value = false;
    clearBtnText.value = "清空收藏夹";
  }
  timer = setTimeout(() => {
    clearBtnText.value = "清空收藏夹";
    clearable.value = false;
  }, 3000);
  clearable.value = true;
};

//导入和导出

//导出
const exportSettings = () => {
  const url = window.URL || window.webkitURL || window;
  const blob = new Blob([
    JSON.stringify({
      Configs: toRaw(Configs.$state),
      HistorySearch: toRaw(HistorySearch.$state),
    }),
  ]);
  const saveLink: any = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "a"
  );
  saveLink.href = url.createObjectURL(blob);
  saveLink.download = "kano-start-there-configs.json";
  saveLink.click();
  Toast({
    value: `操作成功！`,
    color: "green",
    duration: 1000,
    background: "#00000099",
  });
};
//导入
const fileInput = ref();
const {change} = useImportConfigs({maxUploadSize: 4});
const importSettings = () => {
  fileInput.value.click();
};

const fileInputChange = async (e: Event) => {
  try {
    const res = await change(e);
    let {Configs: config, HistorySearch: hisSearch} = JSON.parse(res.data);
    if (!config && !hisSearch) throw new Error();
    Configs.importSettings(config);
    HistorySearch.importSettings(hisSearch);
    Toast({
      value: `导入成功,一秒后刷新页面`,
      color: "green",
      duration: 1000,
      background: "#00000099",
      success: () => {
        location.reload();
      },
    });
  } catch (e) {
    Toast({
      value: `导入出错，请检查文件格式！`,
      color: "red",
      duration: 2000,
      background: "#00000099",
    });
  }
};
</script>

<style lang="less" scoped>
.swipe-enter-active {
  transition: all 0.3s cubic-bezier(0.5, 0.59, 0, 1);
  transform: scale(1);
  transform-origin: right top;
  opacity: 1;
}

.swipe-enter-from {
  transition: all 0.3s cubic-bezier(0.5, 0.59, 0, 1);
  position: absolute;
  transform: scale(0);
  transform-origin: left top;
  opacity: 0;
}

.setting-content {
  overflow-y: auto;
}

.option {
  .box {
    border: 2px dashed pink;
    margin: 10px;
    border-radius: 6px;

    .title {
      font-size: 20px;
      margin: 8px;
      margin-bottom: 14px;
      font-weight: bold;
    }
  }
}

.filterList {
  max-width: 400px;

  .filter-item {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: none;
      white-space: nowrap;
    }
  }

  .close {
    height: 24px;
    width: 24px;
    margin: 0 5px;

    .close-icon {
      fill: #fff;
    }
  }
}
</style>
