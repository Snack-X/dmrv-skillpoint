<template>
  <base-selector class="button-selector">
    <li
      v-for="button in BUTTONS" :key="`button-${button}`"
      class="nav-item"
    >
      <a class="nav-link" :class="{ 'active': value === button }" @click="$emit('input', button)">{{ button }} BUTTONS</a>
    </li>
  </base-selector>
</template>

<script>
import { BUTTONS } from '../../data/consts';
import BaseSelector from './BaseSelector';

export default {
  components: {
    BaseSelector,
  },

  props: {
    value: {
      type: String,
      default: '4',
    },
  },

  computed: {
    BUTTONS() { return BUTTONS; },
  },
};
</script>

<style lang="scss" scoped>
@import '../../css/functions.scss';
@import "../../css/variables.scss";

.button-selector {
  @include nav-colors((
    $color-4buttons, $color-5buttons, $color-6buttons, $color-8buttons
  ));
}
</style>
