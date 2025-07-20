// src/components/MiniHAZChart.jsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { whoReference } from '../data/whoReference';

export default function MiniHAZChart({ age, height, gender }) {
  // Memoize chart data untuk performa
  const data = useMemo(() => {
    const refEntry = whoReference.hazLookup[gender]?.[age];
    if (!refEntry) return [];
    const { L, M, S } = refEntry;
    // SD curves
    const sdLevels = [-2, -1, 0, 1, 2];
    const points = sdLevels.map(z => {
      const sdValue = L !== 0
        ? M * Math.pow(1 + L * S * z, 1 / L)
        : M * Math.exp(S * z);
      return { name: `SD${z}`, value: parseFloat(sdValue.toFixed(1)) };
    });
    // Titik anak
    points.push({ name: 'Anak', value: height });
    return points;
  }, [age, height, gender]);

  if (data.length === 0) {
    return (
      <div role="img" aria-label="Data tidak tersedia" className="text-xs text-gray-400">
        No data
      </div>
    );
  }

  return (
    <figure>
      <ResponsiveContainer width={100} height={50}>
        <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis dataKey="name" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            wrapperStyle={{ fontSize: '10px' }}
            formatter={(value, name) => [value, name]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#047857"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">Grafik Mini HAZ untuk usia {age} bulan</figcaption>
    </figure>
  );
}
