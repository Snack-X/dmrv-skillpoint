<template>
  <div v-if="$store.state.ready">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">
          DMR V Skillpoint
        </a>

        <ul class="navbar-nav">
          <li class="nav-item" :class="{ 'active': currentView === 'score' }">
            <a class="nav-link" @click="currentView = 'score'">SCORE INPUT</a>
          </li>
          <li class="nav-item" :class="{ 'active': currentView === 'rank' }">
            <a class="nav-link" @click="currentView = 'rank'">RANK CHECK</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- self-closing tags does not work correctly -->
    <!-- Ref: https://github.com/parcel-bundler/parcel/issues/1363 -->
    <score-input-view v-if="currentView === 'score'"></score-input-view>
    <rank-check-view v-if="currentView === 'rank'"></rank-check-view>
  </div>
</template>

<script>
import ScoreInputView from './view/ScoreInputView';
import RankCheckView from './view/RankCheckView';

export default {
  components: {
    ScoreInputView,
    RankCheckView,
  },

  data() {
    return {
      currentView: 'score',
    }
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
