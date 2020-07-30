const {
  MAX_SKILL_POINT_PER_LEVEL,
  MULTIPLIER_PERPECT,
  MULTIPLIER_NOT_MAX_COMBO,
} = require('./consts');

/**
 * Calculate skill point
 * @param {'4'|'5'|'6'|'8'} buttons
 * @param {string} level
 * @param {number} accuracy from 0 to 1
 * @param {boolean} isMaxCombo
 */
module.exports.getSkillpoint = function (buttons, level, accuracy, isMaxCombo) {
  const maxSp = MAX_SKILL_POINT_PER_LEVEL[buttons][level];

  if (accuracy >= 1) return maxSp * MULTIPLIER_PERPECT;

  let sp = maxSp;
  if (accuracy < 0.85) {
    sp *= 10 / 17 * accuracy;
  } else {
    sp *= 50 * (Math.pow((accuracy * 100 - 85) / 15, Math.exp(1)) + 1) / 100;
  }

  if (!isMaxCombo) sp *= MULTIPLIER_NOT_MAX_COMBO;

  return sp;
};
