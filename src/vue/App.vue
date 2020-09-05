<template>
  <div v-if="$store.state.ready">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">
          DMR V Skillpoint <sub>{{ pkgVersion }}</sub>
        </a>

        <ul class="navbar-nav">
          <li v-for="(text, menu) in menuItems" :key="`menu-${menu}`" class="nav-item" :class="{ 'active': currentView === menu }">
            <a class="nav-link" @click="currentView = menu">{{ text }}</a>
          </li>
        </ul>
      </div>
    </nav>

    <component :is="viewComponent"></component>
  </div>
</template>

<script>
import { version as pkgVersion } from '/../package.json';
import HelpView from '/vue/view/HelpView';
import ScoreInputView from '/vue/view/ScoreInputView';
import RankCheckView from '/vue/view/RankCheckView';
import StatisticsView from '/vue/view/StatisticsView';

export default {
  data() {
    return {
      currentView: 'score',
    }
  },

  computed: {
    pkgVersion() { return pkgVersion; },

    menuItems() {
      return {
        help: 'HELP',
        score: 'SCORE INPUT',
        rank: 'RANK CHECK',
        stats: 'STATISTICS',
      };
    },

    viewComponent() {
      return {
        help: HelpView,
        score: ScoreInputView,
        rank: RankCheckView,
        stats: StatisticsView,
      }[this.currentView];
    },
  },

  async created() {
    if (!this.$store.state.ready) {
      await this.$store.dispatch('init');
    }
  },
};
</script>

<style lang="scss" scoped>
.nav-link {
  cursor: pointer;
}
</style>
