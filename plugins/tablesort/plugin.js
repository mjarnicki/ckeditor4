CKEDITOR.plugins.add( 'tablesort', {
    lang: 'en,pl',
    icons: 'tablesort',

    init: function( editor ) {
        editor.addCommand( 'sortTable', {
            exec: function( editor ) {
                editor.insertHtml( 'Test' );
            }
        });
        
        editor.ui.addButton( 'TableSort', {
            label: editor.lang.tablesort.label,
            command: 'sortTable',
            toolbar: 'insert'
        });
    }
});