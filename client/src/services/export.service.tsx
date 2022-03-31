export const exportCSV = (data: any[], name: string='download') => {
  const csvData = convertToCSV(data);
  downloadCSV(csvData, name);
};

const convertToCSV = (data: any[]): string => {
  const csvRows: string[] = [];

  const header = Object.keys(data[0] || {});
  csvRows.push(header.join(','));

  data.forEach((value) => {
    const values = Object.values(value).join(',');
    csvRows.push(values);
  });

  return csvRows.join('\n');
};

const downloadCSV = (data: string, name: string) => {
  const blob = new Blob([data], {type: 'text/csv'});
  const url = window.URL.createObjectURL(blob);

  const aElement = document.createElement('a');
  aElement.setAttribute('href', url);
  aElement.setAttribute('download', `${name}.csv`);
  aElement.click();
};
