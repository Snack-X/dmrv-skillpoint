<template>
  <base-selector class="button-selector">
    <li
      v-for="button in BUTTONS" :key="`button-${button}`"
      class="nav-item"
    >
      <a
        class="nav-link" :class="{ 'active': button === selectedButton }"
        @click="onClick(button)"
      >
        {{ button }} BUTTONS
      </a>
    </li>
  </base-selector>
</template>

<script>
import { BUTTONS } from '/data/consts';
import BaseSelector from '/vue/components/base/BaseSelector';

export default {
  components: {
    BaseSelector,
  },

  computed: {
    BUTTONS() { return BUTTONS; },
    selectedButton() { return this.$store.getters.getSelectedButton; },
  },

  created() {
    this.$emit('update', this.selectedButton);
  },

  methods: {
    onClick(button) {
      this.$store.dispatch('selectButton', button);
      this.$emit('update', button);
    },
  }
};
</script>

<style lang="scss" scoped>
@import '/css/functions.scss';
@import '/css/variables.scss';

.button-selector {
  @include nav-colors((
    $color-4buttons, $color-5buttons, $color-6buttons, $color-8buttons
  ));
}
</style>
