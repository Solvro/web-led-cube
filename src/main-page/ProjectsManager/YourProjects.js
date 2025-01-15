import DataTable, { createTheme } from 'react-data-table-component';

export const YourProjects = () => {
    const columns = [
        {
            name: 'Title',
            selector: row => row.title,
        },
        {
            name: 'Date',
            selector: row => row.date,
        },
        {
            name: 'Author',
            selector: row => row.author,
        },
        {
            name: '',
            selector: row => row.buttons,
        },
    ];
    
    const data = [
          {
            id: 1,
            title: 'Fireplace',
            date: '14.02.2025',
            author: 'xxUSERxX',
    
        },
        {
            id: 2,
            title: 'Fireplace',
            date: '14.02.2025',
            author: 'xxUSERxX'
        },
    ]

    createTheme(
        'solarized',
        {
            text: {
                primary: '#268bd2',
                secondary: '#2aa198',
            },
            background: {
                default: '#191b20',
            },
            context: {
                background: '#cb4b16',
                text: '#FFFFFF',
            },
            divider: {
                default: '#073642',
            },
            button: {
                default: '#2aa198',
                hover: 'rgba(0,0,0,.08)',
                focus: 'rgba(255,255,255,.12)',
                disabled: 'rgba(255, 255, 255, .34)',
            },
            sortFocus: {
                default: '#2aa198',
            },
        },
        'dark',
    );
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      theme="solarized"
    />
  )
}
