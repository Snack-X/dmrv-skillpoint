<template>
  <base-selector class="category-selector">
    <li
      v-for="category in CATEGORIES" :key="`category-${category}`"
      class="nav-item"
    >
      <a class="nav-link" :class="{ 'active': value === category }" @click="$emit('input', category)">{{ category }}</a>
    </li>
  </base-selector>
</template>

<script>
import { CATEGORIES } from '/data/consts';
import BaseSelector from '/vue/components/base/BaseSelector';

export default {
  components: {
    BaseSelector,
  },

  props: {
    value: {
      type: String,
      default: 'RESPECT',
    },
  },

  computed: {
    CATEGORIES() { return CATEGORIES; },
  },
};
</script>

<style lang="scss" scoped>
@import '/css/functions.scss';
@import '/css/variables.scss';

.category-selector {
  @include nav-colors((
    $color-respect, $color-portable1, $color-portable2, $color-trilogy, $color-clazziquai, $color-blacksquare,
    $color-technika1, $color-technika2, $color-technika3,
    $color-vextension, $color-emotionals,
    $color-guiltygear, $color-cytus, $color-deemo, $color-groovecoaster
  ));
}
</style>
