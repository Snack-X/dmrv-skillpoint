<template>
  <section class="score-input-view">
    <div class="container">
      <h3 class="nav-title">BUTTON</h3>
      <button-selector v-model="currentButton"></button-selector>

      <h3 class="nav-title">CATEGORY</h3>
      <category-selector v-model="currentCategory"></category-selector>

      <div class="row row-table-top">
        <div class="col">
          <h3 class="table-title">DATA INPUT</h3>
        </div>
        <div class="col-auto ml-auto">
          <button type="button" class="btn btn-success" @click="isImportModalShown = true">IMPORT</button>
          <button type="button" class="btn btn-primary" @click="isExportModalShown = true">EXPORT</button>
          <button type="button" class="btn btn-danger" @click="resetData">RESET</button>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>TITLE</th>
            <th class="text-center">NM</th>
            <th class="text-center">HD</th>
            <th class="text-center">MX</th>
            <th class="text-center">SC</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <!-- kinda hack to reload data from database everytime button changes -->
          <score-input-row
            v-for="music in musics" :key="music.title + currentButton + rerenderKey"
            :music="music" :button="currentButton"
          ></score-input-row>
        </tbody>
      </table>

      <import-modal v-model="isImportModalShown" :current-button="currentButton" @imported="triggerRerender"></import-modal>
      <export-modal v-model="isExportModalShown" :current-button="currentButton"></export-modal>
    </div>
  </section>
</template>

<script>
import ButtonSelector from '../components/ButtonSelector';
import CategorySelector from '../components/CategorySelector';
import ScoreInputRow from '../components/ScoreInputRow';
import ImportModal from '../components/ImportModal';
import ExportModal from '../components/ExportModal';

export default {
  components: {
    ButtonSelector,
    CategorySelector,
    ScoreInputRow,
    ImportModal,
    ExportModal,
  },

  data() {
    return {
      rerenderKey: 1,

      currentButton: '4',
      currentCategory: 'RESPECT',

      musics: [],

      isImportModalShown: false,
      isExportModalShown: false,
    };
  },

  watch: {
    currentCategory() { this.loadMusics(); },
  },

  created() {
    this.loadMusics();
  },

  methods: {
    loadMusics() {
      this.musics = this.$store.getters.getMusicsByCategory(this.currentCategory);
    },

    async resetData() {
      const answer = confirm('브라우저에 저장된 모든 데이터를 삭제합니다. 이 작업은 되돌릴 수 없습니다. 정말로 삭제할까요?');
      if (!answer) return;

      this.$store.dispatch('destroy');
      await this.$store.dispatch('init');
      this.triggerRerender();
    },

    triggerRerender() {
      this.$nextTick(() => {
        this.rerenderKey += 1;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";

.score-input-view {
  margin: 1rem 0;
}

.nav-title {
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
}

.row-table-top {
  margin-top: 2rem;
  margin-bottom: 1rem;

  .btn {
    font-weight: bold;
  }
}

.table-title {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
