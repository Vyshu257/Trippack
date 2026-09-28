import React, { useState } from 'react';
import { SunMedium, MapPin, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { DayWeather, WeatherMetric } from '../../types';
import { INITIAL_WEATHER_DATA } from '../../data/mockData';

interface WeatherScreenProps {
  fromLocation: string;
  toLocation: string;
  onNext?: () => void;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({
  fromLocation = 'Hyderabad',
  toLocation = 'Bangalore',
  onNext,
}) => {
  const [activeMetric, setActiveMetric] = useState<WeatherMetric>('Temperature');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const metrics: WeatherMetric[] = ['Temperature', 'AQI', 'Humidity', 'Rain Chances'];

  // Metric configuration
  const getMetricConfig = () => {
    switch (activeMetric) {
      case 'Temperature':
        return {
          unit: '°C',
          yAxisLabel: 'Temperature (°C)',
          yMin: 10,
          yMax: 40,
          fromKey: 'tempFrom' as const,
          toKey: 'tempTo' as const,
          fromSummary: '24°C - 32°C',
          toSummary: '28°C - 36°C',
          ticks: [10, 15, 20, 25, 30, 35],
        };
      case 'AQI':
        return {
          unit: ' AQI',
          yAxisLabel: 'Air Quality Index (AQI)',
          yMin: 0,
          yMax: 120,
          fromKey: 'aqiFrom' as const,
          toKey: 'aqiTo' as const,
          fromSummary: '68 - 80 (Moderate)',
          toSummary: '52 - 65 (Good)',
          ticks: [20, 40, 60, 80, 100],
        };
      case 'Humidity':
        return {
          unit: '%',
          yAxisLabel: 'Humidity (%)',
          yMin: 20,
          yMax: 80,
          fromKey: 'humidityFrom' as const,
          toKey: 'humidityTo' as const,
          fromSummary: '38% - 50%',
          toSummary: '48% - 60%',
          ticks: [20, 40, 60, 80],
        };
      case 'Rain Chances':
        return {
          unit: '%',
          yAxisLabel: 'Precipitation Probability (%)',
          yMin: 0,
          yMax: 60,
          fromKey: 'rainFrom' as const,
          toKey: 'rainTo' as const,
          fromSummary: '0% - 20% (Low)',
          toSummary: '5% - 25% (Mild)',
          ticks: [0, 15, 30, 45, 60],
        };
    }
  };

  const config = getMetricConfig();

  // SVG Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 20;
  const padBottom = 35;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const getYPos = (val: number) => {
    const clamped = Math.max(config.yMin, Math.min(val, config.yMax));
    const ratio = (clamped - config.yMin) / (config.yMax - config.yMin);
    return padTop + chartH - ratio * chartH;
  };

  const getXPos = (index: number) => {
    return padLeft + (index / (INITIAL_WEATHER_DATA.length - 1)) * chartW;
  };

  // Generate SVG path strings
  const fromPoints = INITIAL_WEATHER_DATA.map((d, i) => `${getXPos(i)},${getYPos(d[config.fromKey])}`);
  const toPoints = INITIAL_WEATHER_DATA.map((d, i) => `${getXPos(i)},${getYPos(d[config.toKey])}`);

  const fromPathStr = `M ${fromPoints.join(' L ')}`;
  const toPathStr = `M ${toPoints.join(' L ')}`;

  return (
    <div className="w-full bg-white rounded-2xl border border-blue-100/90 shadow-xs p-5 sm:p-7 flex flex-col gap-6">
      {/* Title */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
          <SunMedium className="w-5 h-5 stroke-[2.5]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Weather Report
        </h2>
      </div>

      {/* Metric Tabs */}
      <div className="flex flex-wrap gap-2">
        {metrics.map((m) => {
          const isActive = activeMetric === m;
          return (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#1746A2] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-blue-700 hover:bg-blue-50/60 border border-gray-200'
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-end gap-6 text-xs sm:text-sm font-semibold text-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block shadow-2xs"></span>
          <span>From Location ({fromLocation || 'Origin'})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#EA580C] inline-block shadow-2xs"></span>
          <span>To Location ({toLocation || 'Destination'})</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full bg-white rounded-xl border border-gray-100 p-2 sm:p-4 overflow-x-auto">
        <div className="min-w-[480px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Grid lines & Y Ticks */}
            {config.ticks.map((tick) => {
              const y = getYPos(tick);
              return (
                <g key={tick}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="#F1F5F9"
                    strokeWidth="1.2"
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94A3B8"
                    fontWeight="500"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Y Axis Label */}
            <text
              transform={`rotate(-90)`}
              x={-(svgHeight / 2)}
              y="12"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="#64748B"
            >
              {config.yAxisLabel}
            </text>

            {/* From Location Line (Blue) */}
            <path
              d={fromPathStr}
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* To Location Line (Orange) */}
            <path
              d={toPathStr}
              fill="none"
              stroke="#EA580C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dots and interactive hover targets */}
            {INITIAL_WEATHER_DATA.map((d, i) => {
              const x = getXPos(i);
              const yFrom = getYPos(d[config.fromKey]);
              const yTo = getYPos(d[config.toKey]);
              const isHovered = hoveredIndex === i;

              return (
                <g key={i}>
                  {/* Vertical hover indicator */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padTop}
                      x2={x}
                      y2={padTop + chartH}
                      stroke="#94A3B8"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />
                  )}

                  {/* X Axis Date Labels */}
                  <text
                    x={x}
                    y={padTop + chartH + 18}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isHovered ? '700' : '500'}
                    fill={isHovered ? '#1E293B' : '#64748B'}
                  >
                    {d.date}
                  </text>

                  {/* From Dot (Blue) */}
                  <circle
                    cx={x}
                    cy={yFrom}
                    r={isHovered ? 5.5 : 4}
                    fill="#2563EB"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all"
                  />

                  {/* To Dot (Orange) */}
                  <circle
                    cx={x}
                    cy={yTo}
                    r={isHovered ? 5.5 : 4}
                    fill="#EA580C"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all"
                  />

                  {/* Invisible Hit Target for Hover */}
                  <rect
                    x={x - 20}
                    y={padTop}
                    width="40"
                    height={chartH + padBottom}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div className="absolute top-2 right-4 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-md pointer-events-none flex items-center gap-3">
            <span className="font-semibold text-gray-300">
              {INITIAL_WEATHER_DATA[hoveredIndex].date}:
            </span>
            <span className="text-blue-300 font-bold">
              {fromLocation}: {INITIAL_WEATHER_DATA[hoveredIndex][config.fromKey]}{config.unit}
            </span>
            <span className="text-orange-300 font-bold">
              {toLocation}: {INITIAL_WEATHER_DATA[hoveredIndex][config.toKey]}{config.unit}
            </span>
          </div>
        )}
      </div>

      {/* Two Location Summary Cards Below Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* From Location Card */}
        <div className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1746A2] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500">From Location ({fromLocation || 'Origin'})</div>
            <div className="text-xs text-gray-400 font-medium">{activeMetric}</div>
            <div className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
              {config.fromSummary}
            </div>
          </div>
        </div>

        {/* To Location Card */}
        <div className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1746A2] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500">To Location ({toLocation || 'Destination'})</div>
            <div className="text-xs text-gray-400 font-medium">{activeMetric}</div>
            <div className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
              {config.toSummary}
            </div>
          </div>
        </div>
      </div>

      {/* Continue to Luggage Action */}
      {onNext && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1746A2] hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-150 cursor-pointer hover:shadow-md"
          >
            <span>Continue to Luggage Suggestion</span>
            <span className="font-bold">➔</span>
          </button>
        </div>
      )}
    </div>
  );
};
