import dayjs from 'dayjs'

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
     .replace('YYYY', YYYY)
     .replace('YY', YY)
     .replace('MMMM', MMMM)
     .replace('MMM', MMM)
     .replace('MM', MM)
     .replace('DD', DD)
 }

 return [
  formatDate(monday),
  formatDate(sunday),
 ]
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
