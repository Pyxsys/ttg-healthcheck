
export const exportCSV = (data: any[]) => {
  const csvdata = convertToCSV(data);
  downloadCSV(csvdata);
};

const convertToCSV = (data: any[]): string => {
  const csvRows: string[] = [];

  const header = Object.keys(data[0]);
  csvRows.push(header.join(','));

  data.forEach((value) => {
    const values = Object.values(value).join(',');
    csvRows.push(values);
  });

  return csvRows.join('\n');
};

const downloadCSV = (data: string) => {
  const blob = new Blob([data], {type: 'text/csv'});
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'download.csv');
  a.click();
};
