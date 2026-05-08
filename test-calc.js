function timeStrToSeconds(str) {
  const parts = str.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
}
function secondsToTimeStr(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds)) return '';
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
console.log(secondsToTimeStr(timeStrToSeconds('15:00') / 3));
console.log(secondsToTimeStr(timeStrToSeconds('4:21') * 3));
