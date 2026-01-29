import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import { IDateRange } from "../../../crawler";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

function getCentury(year: number) {
    return Math.ceil(year / 100);
}

function singleDateExpr(date: Dayjs, now: Dayjs) {
    if (date.isToday()) return 'today';
    if (date.isYesterday()) return 'yesterday';
    
    // 本周内 (过去7天内且不是昨天)
    if (date.isAfter(now.subtract(7, 'day'))) {
      return date.format('dddd').toLowerCase(); 
    }
    
    // 同年: 10/01
    if (date.isSame(now, 'year')) {
      return date.format('MM/DD');
    }
    
    // 同世纪: 23/10/01 (判断世纪是否相同)
    if (getCentury(date.year()) === getCentury(now.year())) {
      return date.format('YY/MM/DD');
    }
    
    // 跨世纪: 1999/12/31
    return date.format('YYYY/MM/DD');
  };

export function compileDateExpr(range?: IDateRange) {
  const now = dayjs();
  if (!range?.start) {
    return singleDateExpr(now, now);
  }
  const dStart = dayjs(range.start);
  if (!range.end || range.end < range.start) {
    return singleDateExpr(dStart, now);
  }
  const dEnd = dayjs(range.end);
  // 1. 同一天的逻辑
  if (dStart.isSame(dEnd, 'day')) {
    return singleDateExpr(dStart, now);
  }

  // 2. 区间逻辑
  const startLabel = singleDateExpr(dStart, now);
  const endLabel = singleDateExpr(dEnd, now);

  // 如果结束是今天/昨天，返回语义化区间: "monday - today"
  if (dEnd.isToday() || dEnd.isYesterday()) {
    return `${startLabel} - ${endLabel}`;
  }

  // 3. 缩减逻辑
  if (dStart.isSame(dEnd, 'year')) {
    if (dStart.isSame(dEnd, 'month')) {
      // 同年同月: "10/01 - 05"
      return `${dStart.format('MM/DD')} - ${dEnd.format('DD')}`;
    }
    // 同年不同月: "10/01 - 11/05"
    return `${dStart.format('MM/DD')} - ${dEnd.format('MM/DD')}`;
  }

  // 4. 跨年情况
  const startYearFormat = getCentury(dStart.year()) === getCentury(now.year()) ? 'YY/MM/DD' : 'YYYY/MM/DD';
  const endYearFormat = getCentury(dEnd.year()) === getCentury(now.year()) ? 'YY/MM/DD' : 'YYYY/MM/DD';

  return `${dStart.format(startYearFormat)} - ${dEnd.format(endYearFormat)}`;
}