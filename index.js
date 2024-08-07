(function() {
    function extractData() {
        const rows = document.querySelectorAll('.wd-tag-row');
        const data = [];

        rows.forEach(row => {
            const columns = row.querySelectorAll('td');
            const triggerColumn = columns[3];
            const lastColumn = columns[columns.length - 1];

            let triggers = '';
            let exceptions = '';

            if (triggerColumn) {
                const triggerText = triggerColumn.textContent.trim();
                const parts = triggerText.split('Exceptions:');
                triggers = parts[0].trim();
                exceptions = parts.length > 1 ? parts[1].trim() : '';
            }

            let status = row.classList.contains('gtm-table-row--paused') ? 'Paused' : 'Active';

            const rowData = {
                name: columns[1]?.querySelector('a')?.textContent.trim() || '',
                type: columns[2]?.textContent.trim() || '',
                triggers: triggers,
                exceptions: exceptions,
                folder: columns[4]?.textContent.trim() || '',
                lastModified: lastColumn?.querySelector('gtm-timestamp span')?.textContent.trim() || '',
                status: status
            };

            data.push(rowData);
        });

        return data;
    }

    function downloadCSV(data) {
        const csv = [
            ['Name', 'Type', 'Triggers', 'Exceptions', 'Folder', 'Last Modified', 'Status'],
            ...data.map(row => [
                row.name,
                row.type,
                row.triggers,
                row.exceptions,
                row.folder,
                row.lastModified,
                row.status
            ])
        ]
        .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, 'gtm_data.csv');
        } else {
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'gtm_data.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const extractedData = extractData();
    downloadCSV(extractedData);
})();
