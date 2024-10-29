<template>
  <Teleport to="body">
    <Transition :name="animation">
      <div class="modal-box" v-if="show">
        <div class="modal dark:dark-modal">
          <slot name="default"> template </slot>
        </div>
        <div class="mask" @click.capture="close"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  animation: {
    type: String,
    default: 'move',
  },
});
const emit = defineEmits<{
  (event: 'close'): void;
}>();

//关闭模态框
const close = (e: Event) => {
  if (e.cancelable) {
    emit('close');
  }
};
</script>

<style lang="less">
@media (max-width: 650px) {
  .modal-box {
    position: relative;
    .modal {
      width: 90% !important;
    }

    .item {
      flex-direction: column;
    }

    .option {
      height: 100% !important;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      span,
      input,
      button {
        margin: 5px;
      }

      .input {
        height: 30px;
      }
    }
  }
}

.modal-box {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: start;

  .mask {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .modal {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: 600px;
    max-height: 80vh;
    overflow: hidden;
    width: 70%;
    margin-top: 40px;
    background-color: rgba(255, 255, 255, 0.3);
    color: #000;
    border-radius: 10px;
    box-shadow: 0px 0px 15px #ffffff96;

    .tab {
      width: 100%;
      height: 30px;
      margin-bottom: 10px;

      .tab-content {
        width: 20%;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        word-wrap: none;
      }

      .tab-active {
        border-bottom: 2px solid #ccc;
      }
    }

    .option {
      margin: 15px 0;
      align-items: center;

      .input {
        padding: 10px;
        background-color: rgb(255 255 255 / 0.5);
        outline: none;
      }

      button {
        height: 100%;
      }
    }
  }
}

.move-enter-active,
.move-leave-active {
  transition: all 0.3s cubic-bezier(0.5, 0.59, 0, 1);
  .modal {
    transition: all 0.3s cubic-bezier(0.5, 0.59, 0, 1);
  }
}

.move-enter-from,
.move-leave-to {
  transition: all 0.3s cubic-bezier(0.5, 0.59, 0, 1);
  opacity: 0;
  .modal {
    transform: translateY(-100%);
  }
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.5, 0.59, 0, 1);
  .modal {
    transition: all 0.3s cubic-bezier(0.5, 0.59, 0, 1);
  }
}

.scale-enter-from,
.scale-leave-to {
  transition: all 0.3s cubic-bezier(0.5, 0.59, 0, 1);
  opacity: 0;
  .modal {
    transform: scale(0);
    transform-origin: top;
  }
}
</style>
