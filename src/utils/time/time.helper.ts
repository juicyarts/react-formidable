export enum DateTimeFormat {
  YYYMMDD = 'YYYY-MM-DD',
  HHMM = 'HH:mm',
}

// FIXME: this is not localizable and will break in some situation
// should rely on formatjs
export function formatDateTimeString(
  dateTimeString: string | undefined,
  dateTimeFormat: DateTimeFormat,
): string {
  if (!dateTimeString) {
    return '';
  }
  const input = new Date(dateTimeString);

  if (Number.isNaN(input.getDate())) {
    return dateTimeString;
  }

  switch (dateTimeFormat) {
    case DateTimeFormat.HHMM:
      return `${input.getHours().toString().padStart(2, '0')}:${input
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

    default:
      return `${input.getFullYear().toString().padStart(4, '0')}-${(input.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${input.getDate().toString().padStart(2, '0')}`;
  }
}
