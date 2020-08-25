<template>
  <base-modal
    class="export-modal" :value="value" title="Data Bulk Import"
    @input="$emit('input', $event)" @show="onShow"
  >
    <template #body>
      <p class="description">스킬포인트 데이터를 내보냅니다.</p>
      <p class="description">이 브라우저에 저장된 데이터를 <strong>IMPORT</strong> 기능을 통해 다른 브라우저나 다른 컴퓨터에서 동일하게 불러올 수 있습니다.</p>

      <textarea class="form-control">{{ outputData }}</textarea>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from './BaseModal';
import { CATEGORIES, DIFFICULTIES_LOWERCASE } from '../../data/consts';

export default {
  components: { BaseModal },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    currentButton: {
      type: String,
      default: '4',
    },
  },

  data() {
    return {
      outputData: '',
    };
  },

  methods: {
    onShow() {
      const firstLine = [
        'VERSION', 'MUSIC',
        'NM', 'Accuracy', 'MAX', 'SP',
        'HD', 'Accuracy', 'MAX', 'SP',
        'MX', 'Accuracy', 'MAX', 'SP',
        'SC', 'Accuracy', 'MAX', 'SP',
      ].join('\t');

      const lines = [firstLine];

      for (const category of CATEGORIES) {
        // console.log(category);
        const musics = this.$store.getters.getMusicsByCategory(category);

        for (const music of musics) {
          // console.log(music.title);
          const score = this.$store.getters.getScore(music.title);
          const skill = this.$store.getters.getSkill(music.title);
          // console.log(JSON.parse(JSON.stringify(score)));
          // console.log(JSON.parse(JSON.stringify(skill)));

          const line = [music.category, music.title];

          for (const difficulty of DIFFICULTIES_LOWERCASE) {
            const key = difficulty + this.currentButton;

            if (music[key]) {
              line.push(
                music[key],
                score && score[key] ? (score[key][0] + '%') : '',
                (score && score[key] && score[key][1]) ? 'Y' : '',
                skill && skill[key] ? skill[key].toFixed(2) : '0.00',
              );
            } else {
              line.push('-', '', '', '0.00');
            }
          }

          // console.log(line);
          lines.push(line.join('\t'));
        }
      }

      const output = lines.join('\n');
      this.outputData = output;
    },
  },
};
</script>

<style lang="scss" scoped>
.export-modal {
  textarea {
    height: 16rem !important;
    font-size: .5rem;
  }
}

.description {
  font-size: .875rem;;
}
</style>
