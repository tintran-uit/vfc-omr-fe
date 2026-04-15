import dayjs from 'dayjs'
import 'dayjs/locale/en'
import type { WeekInfo } from '@/types/dateTimeType'

/**
 * Chuyển chuỗi ISO sang định dạng YYYY-MM-DD
 */
export function convertToDate(isoString: string): string {
  if (!isoString) return ''
  return dayjs(isoString).format('YYYY-MM-DD')
}

/**
 * Tính tuổi từ ngày sinh
 */
export function getAge(birthday: string | Date | null): number {
  if (!birthday) return 0
  return dayjs().diff(dayjs(birthday), 'year')
}

/**
 * Định dạng ngày giờ
 */
export function formatDate(date: string | Date | null, pattern = 'YYYY-MM-DD'): string {
  if (!date) return ''
  return dayjs(date).format(pattern)
}

/**
 *
 * @param {number} year - Năm (VD: 2025)
 * @param {number} week - Số tuần trong năm (VD: 43)
 * @param {string} [format='YY.MM.DD'] - Định dạng ngày (VD: 'YYYY-MM-DD', 'DD/MM/YYYY', 'YY.MM.DD')
 * @returns [string, string]
 */
export /**
* Trả về ngày bắt đầu (Thứ Hai) và ngày kết thúc (Chủ Nhật)
* của một tuần trong năm (ISO week), hỗ trợ nhiều kiểu format.
*
* @param {number} year - Năm (VD: 2025)
* @param {number} week - Số tuần trong năm (VD: 43)
* @param {string} [format='YY.MM.DD'] - Định dạng ngày
* @returns {{ start: string, end: string }}
*/
function getWeekRange(year, week, format = 'YY.MM.DD') {
 const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 const monthsFull  = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']

 // Ngày 4/1 luôn thuộc tuần 1 ISO
 const simple = new Date(year, 0, 4)
 const dayOfWeek = simple.getDay() || 7
 const firstMonday = new Date(simple)
 firstMonday.setDate(simple.getDate() - dayOfWeek + 1)

 // Tính ngày thứ Hai và Chủ Nhật
 const monday = new Date(firstMonday)
 monday.setDate(firstMonday.getDate() + (week - 1) * 7)
 const sunday = new Date(monday)
 sunday.setDate(monday.getDate() + 6)

 // Hàm format linh hoạt
 const formatDate = (d) => {
  const YYYY = d.getFullYear()
  const YY = String(YYYY).slice(2)
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const DD = String(d.getDate()).padStart(2, '0')
  const MMM = monthsShort[d.getMonth()]
  const MMMM = monthsFull[d.getMonth()]

  return format
    // year
    .replace(/YYYY/g, YYYY)
    .replace(/YY/g, YY)
    // month (long → short → numeric)
    .replace(/MMMM/g, MMMM)
    .replace(/MMM/g, MMM)
    .replace(/MM/g, MM)
    // day
    .replace(/DD/g, DD)
  }

 return [
  formatDate(monday),
  formatDate(sunday),
 ]
}

export function getISOWeekRange(year: number, week: number) {
  // Jan 4 is always in ISO week 1
  const jan4 = new Date(year, 0, 4)
  const day = jan4.getDay() || 7

  const mondayWeek1 = new Date(jan4)
  mondayWeek1.setDate(jan4.getDate() - day + 1)

  const monday = new Date(mondayWeek1)
  monday.setDate(mondayWeek1.getDate() + (week - 1) * 7)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return [ monday, sunday ]
}

// export function formatDate(
//   date: Date,
//   format = 'YY.MM.DD',
// ) {
//   const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

//   const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June',
//                       'July', 'August', 'September', 'October', 'November', 'December']

//   const YYYY = date.getFullYear()
//   const YY = String(YYYY).slice(2)
//   const MM = String(date.getMonth() + 1).padStart(2, '0')
//   const DD = String(date.getDate()).padStart(2, '0')
//   const MMM = monthsShort[date.getMonth()]
//   const MMMM = monthsFull[date.getMonth()]

//   return format
//     .replace(/YYYY/g, String(YYYY))
//     .replace(/YY/g, YY)
//     .replace(/MMMM/g, MMMM)
//     .replace(/MMM/g, MMM)
//     .replace(/MM/g, MM)
//     .replace(/DD/g, DD)
// }

export function formatDateTimeHumanReadable(dateStr) {
  let locale = 'en';
  let format = 'DD MMM YYYY';
  if (!dateStr) return ''
  return dayjs(dateStr).locale(locale).format(format)
}
  
//   export function toISODate(dateOnly: string): string {
//     if (!dateOnly) return ''
//     // convert "YYYY-MM-DD" thành "YYYY-MM-DDT00:00:00Z"
//     return new Date(dateOnly).toISOString()
//   }



// // 📁 src/helpers/datetimeHelper.ts
// import dayjs from 'dayjs'
// import relativeTime from 'dayjs/plugin/relativeTime'
// import duration from 'dayjs/plugin/duration'
// import localizedFormat from 'dayjs/plugin/localizedFormat'
// import utc from 'dayjs/plugin/utc'
// import timezone from 'dayjs/plugin/timezone'

// // Kích hoạt plugin
// dayjs.extend(relativeTime)
// dayjs.extend(duration)
// dayjs.extend(localizedFormat)
// dayjs.extend(utc)
// dayjs.extend(timezone)

// // Nếu bạn muốn locale tiếng Việt:
// import 'dayjs/locale/vi'
// dayjs.locale('vi')

// // ⚙️ Các hàm tiện ích
// export const datetimeHelper = {
//   /**
//    * Format thời gian (ví dụ: 2025-10-25 -> 25/10/2025)
//    */
//   format(date: string | Date | null, pattern = 'DD/MM/YYYY') {
//     if (!date) return ''
//     return dayjs(date).format(pattern)
//   },

//   /**
//    * Format có giờ (ví dụ: 2025-10-25 15:30)
//    */
//   formatDateTime(date: string | Date | null, pattern = 'DD/MM/YYYY HH:mm') {
//     if (!date) return ''
//     return dayjs(date).format(pattern)
//   },

//   /**
//    * Tính tuổi từ ngày sinh
//    */
//   getAge(birthday: string | Date | null): number {
//     if (!birthday) return 0
//     return dayjs().diff(dayjs(birthday), 'year')
//   },

//   /**
//    * Tính số ngày còn lại đến sinh nhật kế tiếp
//    */
//   daysUntilNextBirthday(birthday: string | Date | null): number {
//     if (!birthday) return 0
//     const b = dayjs(birthday)
//     let next = b.year(dayjs().year())
//     if (next.isBefore(dayjs())) next = next.add(1, 'year')
//     return next.diff(dayjs(), 'day')
//   },

//   /**
//    * Trả về dạng tương đối: "3 giờ trước", "2 ngày nữa"...
//    */
//   fromNow(date: string | Date | null): string {
//     if (!date) return ''
//     return dayjs(date).fromNow()
//   },

//   /**
//    * Tính khoảng cách giữa 2 ngày (trả về text: "2 tháng 3 ngày")
//    */
//   diffHuman(from: string | Date, to: string | Date) {
//     const diff = dayjs(to).diff(dayjs(from))
//     const dur = dayjs.duration(diff)
//     return `${dur.months()} tháng ${dur.days()} ngày`
//   },

//   /**
//    * Tính thời lượng (ví dụ: 90 phút -> "1 giờ 30 phút")
//    */
//   durationText(minutes: number) {
//     const dur = dayjs.duration(minutes, 'minutes')
//     const hours = Math.floor(dur.asHours())
//     const mins = dur.minutes()
//     return `${hours > 0 ? `${hours} giờ ` : ''}${mins} phút`
//   },
// }


function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * ISO week number (Thứ 2 → CN)
 */
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ))

  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(
    (((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7
  )
}

/**
 * Thứ 2 của tuần hiện tại
 */
function getStartOfISOWeek(date: Date): Date {
  const d = startOfDay(date)
  const day = d.getDay() || 7 // CN = 7
  d.setDate(d.getDate() - (day - 1))
  return d
}

/**
 * Chủ nhật của tuần hiện tại
 */
function getEndOfISOWeek(date: Date): Date {
  const start = getStartOfISOWeek(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return end
}

export function getWeeksOfMonth(
  year: number,
  month: number // 1–12
): WeekInfo[] {
  const result: WeekInfo[] = []
  const today = startOfDay(new Date())

  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 0)

  // 👉 tìm Monday đầu tiên liên quan
  let current = getStartOfISOWeek(startOfMonth)

  while (current <= endOfMonth) {
    const startDate = getStartOfISOWeek(current)
    const endDate = getEndOfISOWeek(current)

    // ❗ RULE QUAN TRỌNG: chỉ lấy week nếu Chủ Nhật nằm trong tháng
    if (
      endDate.getFullYear() === year &&
      endDate.getMonth() === month - 1
    ) {
      // ❗ optional: bỏ week tương lai
      if (endDate <= today) {
        result.push({
          weekNumber: getISOWeekNumber(endDate),
          startDate,
          endDate,
        })
      }
    }

    // 👉 nhảy sang tuần tiếp theo
    current.setDate(current.getDate() + 7)
  }

  return result
}