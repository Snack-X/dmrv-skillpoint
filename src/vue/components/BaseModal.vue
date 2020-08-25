<template>
  <div ref="modal" class="modal fade">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="close" @click="hideModal">
              <span>&times;</span>
            </button>
          </slot>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn btn-secondary" @click="hideModal">닫기</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jquery from 'jquery';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },
  },

  watch: {
    value(val, oldVal) {
      if (!oldVal && val) {
        this.showModal();
      } else if (oldVal && !val) {
        this.hideModal();
      }
    },
  },

  data() {
    return {
      jqModal: null,
      onShowHandler: null,
      onHideHandler: null,
    };
  },

  mounted() {
    this.jqModal = jquery(this.$refs.modal);
    this.onShowHandler = () => { this.onShow(); };
    this.onHideHandler = () => { this.onHide(); };

    this.jqModal.on('show.bs.modal', this.onShowHandler);
    this.jqModal.on('hide.bs.modal', this.onHideHandler);
  },

  beforeDestroy() {
    this.jqModal.off('show.bs.modal', this.onShowHandler);
    this.jqModal.off('hide.bs.modal', this.onHideHandler);
  },

  methods: {
    onShow() {
      this.$emit('show');
      this.$emit('input', true);
    },

    onHide() {
      this.$emit('hide');
      this.$emit('input', false);
    },

    showModal() {
      this.jqModal.modal('show');
    },

    hideModal() {
      this.jqModal.modal('hide');
    },
  }
};
</script>
