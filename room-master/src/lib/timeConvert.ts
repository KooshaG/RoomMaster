
// converts strings of format 00:00:00 to 00:00 AM/PM
export default function convert(time: string){ 
  const [hours, mins] = time.split(':');
  const numHours = parseInt(hours);
  if (numHours ===  12) {
    return `${numHours}:${mins} PM`;
  }
  if (numHours > 12) {
    return `${numHours-12}:${mins} PM`;
  }
  return `${numHours}:${mins} AM`;
}
