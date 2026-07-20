import { ChartOptions } from '../config/ApexChart';
export type ChartKey = 'users' | 'projects' | 'tasks';

const chartColors = {
  light: {
    users: '#C97A2B',
    projects: '#176B52',
    tasks: '#2563AC',
  },
  dark: {
    users: '#E29E54',
    projects: '#34C896',
    tasks: '#4BA3FF',
  },
};

export const PROJECT_STATUS_COLORS = {
  light: [
    '#176B52', // Active
    '#D97706', // Suspended
    '#2563EB', // Completed
    '#6B7280', // Archived
  ],

  dark: [
    '#34C896',
    '#F4B740',
    '#60A5FA',
    '#9CA3AF',
  ],
};

export const TASK_STATUS_COLORS = {
  light: [
    '#6B7280', // Pending
    '#2563EB', // In Progress
    '#176B52', // Completed
    '#DC2626', // Cancelled
  ],

  dark: [
    '#A1A1AA',
    '#60A5FA',
    '#34C896',
    '#F87171',
  ],
};

export const TASK_PRIORITY_COLORS = {
  light: [
    '#16A34A', // Low
    '#EAB308', // Medium
    '#EA580C', // High
    '#DC2626', // Urgent
  ],

  dark: [
    '#4ADE80',
    '#FACC15',
    '#FB923C',
    '#F87171',
  ],
};
export function buildChartOptions(
  data: { label: string; count: number }[],
  title: string,
  key: ChartKey,
  dark?: boolean,
): Partial<ChartOptions> {
   const color = dark
    ? chartColors.dark[key]
    : chartColors.light[key];
  if (!data) {
    return {
      series: [],
      labels: [],
      chart: {
        type: 'donut',
      },
    };
  }
  return {
    series: [
      {
        name: title,
        data: data.map((x) => x.count),
      },
    ],

    chart: {
      type: 'bar',
  foreColor: dark ? '#E5E7EB' : '#374151',
      height: 350,
      toolbar: {
        show: false,
      },
    },

    colors: [color],

    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
      },
    },

    dataLabels: {
      enabled: true,
    },

    xaxis: {
      categories: data.map((x) => x.label),

      axisBorder: {
        show: true,
      },

      axisTicks: {
        show: true,
      },
    },

    yaxis: {
      min: 0,
    },

    grid: {
      borderColor: '#E5E7EB',
    },

    title: {
      text: title,
      align: 'left',
      style: {
        color: color,
      },
    },

    tooltip: {
      y: {
        formatter(value) {
          return `${value}`;
        },
      },
    },
  };
}

export function buildDonutChartOptions(
  type: 'PROJECT_STATUS' | 'TASK_STATUS' | 'TASK_PRIORITY',
  data: Record<string, { count: number }>,
  labelMap: Record<string, string>,
  translate: (key: string) => string,
  dark: boolean
): Partial<ChartOptions> {
  if (!data) {
    return {
      series: [],
      labels: [],
      chart: {
        type: 'donut',
      },
    };
  }

  return {
    theme: {
      mode: dark ? 'dark' : 'light',
    },
    colors: type == 'PROJECT_STATUS' ? PROJECT_STATUS_COLORS[dark ? 'dark' : 'light'] : type == 'TASK_STATUS' ? TASK_STATUS_COLORS[dark ? 'dark' : 'light'] : TASK_PRIORITY_COLORS[dark ? 'dark' : 'light'],

    series: Object.values(data).map(item => item.count),

    labels: Object.keys(data).map(key =>
      translate(labelMap[key] ?? key)
    ),

    chart: {
      type: 'donut',
  foreColor: dark ? '#E5E7EB' : '#374151',
      toolbar: {
        show: false,
      },
    },

    legend: {
      formatter: (label, opts) =>
        `${label} - ${opts.w.globals.series[opts.seriesIndex]}`,
    },

    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },

    dataLabels: {
      enabled: false,
    },

    fill: {
      type: 'gradient',
    },
  };
}
