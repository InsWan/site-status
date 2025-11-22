/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { formatNumber } from "./helper";
import type {
  MonitorsDataResult,
  SiteDaysStatus,
  SiteStatusType,
} from "~~/types/main";

/**
 * Format site data.
 * @param data The site data to format.
 * @returns The formatted site data.
 */
export const formatSiteData = (
  data: any,
  dates: dayjs.Dayjs[],
): MonitorsDataResult | undefined => {
  if (!data?.monitors) return undefined;
  const { public: configPublic } = useRuntimeConfig();
  const { showLink } = configPublic;
  const sites: any[] = data.monitors;
  // 解析站点数据
  const formatData = sites?.map((site: any): SiteStatusType => {
    // 解析每日数据
    const ranges = (site.custom_uptime_ranges || "").split("-");
    const percent = formatNumber(ranges.pop() || 0);
    const dailyData: SiteDaysStatus[] = [];
    const timeMap = new Map();
    // 处理每日数据
    dates.forEach((date, index) => {
      timeMap.set(date.format("YYYYMMDD"), index);
      dailyData[index] = {
        date: date.unix(),
        percent: formatNumber(ranges[index] || 0),
        down: { times: 0, duration: 0 },
      };
    });
    // 获取总数据：将日志配对为 down interval，然后把每个 interval 的时长拆分到对应的天
    const total = { times: 0, duration: 0 };
    const logs = (site?.logs || []).slice();
    // 计算日期范围
    const startUnix = dates[dates.length - 1]!.unix();
    const endUnix = dates[0]!.add(1, "day").unix();

    // 按时间升序排序，便于配对
    logs.sort((a: any, b: any) => (a.datetime || 0) - (b.datetime || 0));

    const intervals: Array<{ start: number; end: number }> = [];
    let pendingDown: number | null = null;

    // 如果 API 提供了 lastLogTypeBeforeStartDate，且其 type 为 1，表示在范围开始之前已经处于 down
    if (site?.lastLogTypeBeforeStartDate?.type === 1) {
      pendingDown = startUnix;
    }

    for (const log of logs) {
      const t = log?.type;
      const dt = Number(log?.datetime) || 0;
      const dur = Number(log?.duration) || 0;
      if (t === 1) {
        // down 事件
        if (dur && dur > 0) {
          // 直接有持续时长，构成一个 interval
          intervals.push({ start: dt, end: dt + dur });
        } else {
          // 无持续时长，可能需要与后续的 up 配对
          if (pendingDown === null) pendingDown = dt;
        }
      } else if (t === 2) {
        // up 事件，若有未闭合的 down，则闭合
        if (pendingDown !== null) {
          const s = pendingDown;
          const e = dt;
          if (e > s) intervals.push({ start: s, end: e });
          pendingDown = null;
        }
      }
    }

    // 如果还有未闭合的 down（例如当前仍在宕机），则以结束时间为现在或范围结束
    if (pendingDown !== null) {
      const now = Math.floor(Date.now() / 1000);
      const end = Math.min(now, endUnix);
      if (end > pendingDown) intervals.push({ start: pendingDown, end });
      pendingDown = null;
    }

    // 如果没有通过日志解析出任何 interval，但监控状态表明在范围内处于 down（或范围开始前已 down），
    // 则补生成一个从范围开始到现在/范围结束的 interval，以便把长期宕机拆分到每一天。
    if (intervals.length === 0 && (site?.status === 8 || site?.status === 9 || site?.lastLogTypeBeforeStartDate?.type === 1)) {
      const now = Math.floor(Date.now() / 1000);
      const s = startUnix;
      const e = Math.min(now, endUnix);
      if (e > s) intervals.push({ start: s, end: e });
    }

    // 将每个 interval 的时长拆分到各个 day
    for (const itv of intervals) {
      const s = Math.max(itv.start, startUnix);
      const e = Math.min(itv.end, endUnix);
      if (e <= s) continue;
      total.times += 1;
      total.duration += e - s;
      // 更清晰地按每一天遍历并计算重叠
      for (let idx = 0; idx < dates.length; idx++) {
        const day = dates[idx]!;
        const dayStart = day.unix();
        const dayEnd = day.add(1, "day").unix();
        const overlapStart = Math.max(s, dayStart);
        const overlapEnd = Math.min(e, dayEnd);
        const overlap = Math.max(0, overlapEnd - overlapStart);
        if (overlap > 0) {
          // 增加当日 down 时长
          const dd = dailyData[idx];
          if (dd) {
            dd.down.duration += overlap;
            dd.down.times += 1;
          }
        }
      }
    }

    // 计算每日 percent（以 86400 秒为基准）
    const DAY_SECONDS = 86400;
    let aggregateDown = 0;
    for (let i = 0; i < dates.length; i++) {
      const dd = dailyData[i];
      const dur = dd?.down?.duration || 0;
      aggregateDown += dur;
      const p = Math.max(0, Math.min(100, ((DAY_SECONDS - dur) / DAY_SECONDS) * 100));
      if (dd) dd.percent = formatNumber(p);
    }
    // 如果 custom_uptime_ranges 中有有效的总体百分比，优先使用它，否则用计算得到的值
    const overallPercentFromRanges = percent;
    const computedOverallPercent = formatNumber(((dates.length * DAY_SECONDS - aggregateDown) / (dates.length * DAY_SECONDS)) * 100);
    const finalPercent = overallPercentFromRanges > 0 ? overallPercentFromRanges : computedOverallPercent;
    // 将 total.duration/ times 保证为整数
    total.duration = Math.floor(total.duration);
    total.times = total.times;
    // 覆盖 percent 变量以便后续返回
    const final_percent = finalPercent;
    return {
      id: site.id,
      name: site?.friendly_name || "未命名站点",
      url: showLink ? site?.url : undefined,
      status: site?.status ?? 8,
      type: site?.type ?? 1,
      interval: site?.interval ?? 0,
      percent: final_percent,
      days: dailyData?.reverse(),
      down: total,
    };
  });
  return {
    status: formatData.reduce(
      (acc, site) => {
        if (site.status === 2) acc.ok++;
        else if (site.status === 8 || site.status === 9) acc.error++;
        else if (site.status === 0 || site.status === 1) acc.unknown++;
        return acc;
      },
      { count: formatData.length, ok: 0, error: 0, unknown: 0 },
    ),
    data: formatData,
    timestamp: Date.now(),
  };
};
