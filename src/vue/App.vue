<template>
  <div v-if="$store.state.ready">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">
          DMR V Skillpoint <sub>1.0.0</sub>
        </a>

        <ul class="navbar-nav">
          <li class="nav-item" :class="{ 'active': currentView === 'help' }">
            <a class="nav-link" @click="currentView = 'help'">HELP</a>
          </li>
          <li class="nav-item" :class="{ 'active': currentView === 'score' }">
            <a class="nav-link" @click="currentView = 'score'">SCORE INPUT</a>
          </li>
          <li class="nav-item" :class="{ 'active': currentView === 'rank' }">
            <a class="nav-link" @click="currentView = 'rank'">RANK CHECK</a>
          </li>
        </ul>
      </div>
    </nav>

    <help-view v-if="currentView === 'help'"></help-view>
    <score-input-view v-if="currentView === 'score'"></score-input-view>
    <rank-check-view v-if="currentView === 'rank'"></rank-check-view>
  </div>
</template>

<script>
import HelpView from './view/HelpView';
import ScoreInputView from './view/ScoreInputView';
import RankCheckView from './view/RankCheckView';

export default {
  components: {
    HelpView,
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
