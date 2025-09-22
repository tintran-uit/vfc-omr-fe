export function convertToDate(isoString: string): string {
    if (!isoString) return ''
    return new Date(isoString).toISOString().slice(0, 10) // "YYYY-MM-DD"
}
  
//   export function toISODate(dateOnly: string): string {
//     if (!dateOnly) return ''
//     // convert "YYYY-MM-DD" thành "YYYY-MM-DDT00:00:00Z"
//     return new Date(dateOnly).toISOString()
//   }