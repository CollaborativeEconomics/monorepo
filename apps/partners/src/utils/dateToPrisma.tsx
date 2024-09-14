export default function dateToPrisma(
  inputDate: number | string | Date,
): string | null {
  let parsedDate = new Date();
  let formattedDate = null;

  try {
    if (inputDate instanceof Date) {
      parsedDate = inputDate;
    } else if (typeof inputDate === 'string') {
      parsedDate = new Date(inputDate);
    }
    formattedDate = parsedDate.toISOString();
  } catch (error) {
    console.error(error);
  }

  return formattedDate;
}
