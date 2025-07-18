// src/utils/forwardChaining.js
// ====================================
// Engine Forward Chaining untuk Sistem Pakar NutriKids-Expert
// Input: kategori HAZ & WHZ → cari rule yang cocok → hasil diagnosis & rekomendasi

import rules from '../data/rules';

/**
 * Melakukan proses forward chaining berdasarkan fakta awal
 * @param {{ HAZ: string, WHZ: string }} facts - kategori hasil Z-Score
 * @returns {{ diagnosis: string, recommendation: string[], ruleId: number } | null }
 */
export function forwardChaining(facts) {
  const { HAZ, WHZ } = facts;

  // Temukan rule pertama yang cocok persis
  const matchedRule = rules.find(rule => {
    return (
      rule.conditions.HAZ === HAZ &&
      rule.conditions.WHZ === WHZ
    );
  });

  if (matchedRule) {
    return {
      diagnosis: matchedRule.diagnosis,
      recommendation: matchedRule.recommendation,
      ruleId: matchedRule.id
    };
  }

  // Tidak ditemukan rule yang cocok
  return null;
}

/**
 * Menyusun logika penelusuran aturan (opsional untuk explainability)
 * @param {{ HAZ: string, WHZ: string }} facts
 * @returns {string} ringkasan rule yang dicek
 */
export function explainRuleTrace(facts) {
  const { HAZ, WHZ } = facts;
  const traces = rules.map(rule => {
    const matched = rule.conditions.HAZ === HAZ && rule.conditions.WHZ === WHZ;
    return `Rule #${rule.id} → ${matched ? 'MATCH' : 'skip'}`;
  });
  return traces.join('\n');
}
