<template>
  <tr class="score-input-row" :class="{ 'is-top-50': isSkillTop50 }">
    <td class="title-cell">{{ music.title }}</td>

    <template v-for="difficulty in DIFFICULTIES_LOWERCASE">
      <template v-if="level[difficulty]">
        <td class="input-cell" :key="`cell-${music.title}-${difficulty}`">
          <div class="input-area">
            <div class="level">{{ level[difficulty] }}</div>
            <div class="accuracy">
              <input :value="accuracy[difficulty]" type="text" @input="onInput('accuracy', difficulty, $event.target.value)">%
            </div>
            <button
              class="btn-maxcombo" :class="{ active: maxcombo[difficulty] }"
              @click="onInput('maxcombo', difficulty, !maxcombo[difficulty])"
            ></button>
            <div class="skill">
              {{ skillpoint[difficulty].toFixed(2) }}
            </div>
          </div>
        </td>
      </template>
      <template v-else>
        <td :key="`cell-${music.title}-${difficulty}`"></td>
      </template>
    </template>

    <td class="skill-cell" :class="{ zero: target === 0 }">{{ target.toFixed(2) }}</td>
  </tr>
</template>

<script>
import { DIFFICULTIES_LOWERCASE } from '~/data/consts';

export default {
  props: {
    music: {
      type: Object,
      required: true,
    },

    button: {
      type: String,
      default: '4',
    },
  },

  data() {
    return {
      DIFFICULTIES_LOWERCASE,

      accuracy: {
        nm: '0.00',
        hd: '0.00',
        mx: '0.00',
        sc: '0.00',
      },
      maxcombo: {
        nm: false,
        hd: false,
        mx: false,
        sc: false,
      },
      skillpoint: {
        nm: 0,
        hd: 0,
        mx: 0,
        sc: 0,
      },
      target: 0,
      isSkillTop50: false,
    };
  },

  computed: {
    level() {
      return {
        nm: this.music['nm' + this.button],
        hd: this.music['hd' + this.button],
        mx: this.music['mx' + this.button],
        sc: this.music['sc' + this.button],
      };
    },
  },

  mounted() {
    const dbScore = this.$store.getters.getScore(this.music.title);
    if (!dbScore) return;

    const dbSkill = this.$store.getters.getSkill(this.music.title) || {};

    for (const diff of DIFFICULTIES_LOWERCASE) {
      const [ accuracy, maxcombo ] = dbScore[diff + this.button] || [ '0.00', false ];
      this.accuracy[diff] = accuracy || '0.00';
      this.maxcombo[diff] = Boolean(maxcombo);

      this.skillpoint[diff] = dbSkill[diff + this.button] || 0;
      this.target = dbSkill['target' + this.button] || 0;
    }

    this.isSkillTop50 = this.$store.getters.getIsSkillTop50(this.button, this.music.title);
  },

  methods: {
    saveToDatabase() {
      const data = {
        title: this.music.title,
      };

      for (const diff of DIFFICULTIES_LOWERCASE) {
        data[diff + this.button] = [ this.accuracy[diff], this.maxcombo[diff] ];
      }

      this.$store.dispatch('saveScore', data);
      this.getSkillpointFromDatabase();
    },

    getSkillpointFromDatabase() {
      const dbSkill = this.$store.getters.getSkill(this.music.title);
      if (!dbSkill) return;

      for (const diff of DIFFICULTIES_LOWERCASE) {
        this.skillpoint[diff] = dbSkill[diff + this.button] || 0;
        this.target = dbSkill['target' + this.button] || 0;
      }

      this.isSkillTop50 = this.$store.getters.getIsSkillTop50(this.button, this.music.title);
    },

    onInput(type, difficulty, value) {
      this[type][difficulty] = value;
      this.saveToDatabase();
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';

.score-input-row {
  td {
    padding: .375rem 0;
    vertical-align: middle;
  }

  &.is-top-50 {
    .title-cell {
      font-weight: bold;
      background-color: lighten($primary, 45%);
    }

    .skill-cell {
      letter-spacing: -1px;
      font-weight: bold;
    }
  }
}

.title-cell {
  padding-left: .5rem !important;
  letter-spacing: -.25px;
}

.input-cell {
  width: 11.25rem;
}

.input-area {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: .875rem;
}

.level {
  margin-right: .25rem;
  width: 2.5rem;
  font-weight: bold;
  text-align: center;
  letter-spacing: -.5px;
}

.accuracy {
  margin-right: .25rem;

  input {
    padding: 0;
    width: 2.75rem;
    text-align: right;
    letter-spacing: -.5px;
    border: 1px solid $gray-300;
    transition: border .25s;

    &:hover {
      border-color: $gray-500;
    }

    &:focus, &:active {
      border-color: $gray-700;
    }
  }
}

.btn-maxcombo {
  margin-right: .25rem;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  border: 0;
  outline: 0;
  background: transparent;
  background-image: url('/images/max_combo.png');
  background-size: cover;
  opacity: .25;
  cursor: pointer;
  transition: opacity .25s;

  &:hover {
    opacity: .5;
  }

  &.active {
    opacity: 1;
  }
}

.skill {
  width: 2.5rem;
  text-align: right;
  letter-spacing: -.5px;
}

.skill-cell {
  width: 3.5rem;
  text-align: center;
  letter-spacing: -.5px;
  background-color: $gray-100;

  &.zero {
    font-size: .875rem;
    font-weight: normal;
    color: $secondary;
  }
}
</style>
