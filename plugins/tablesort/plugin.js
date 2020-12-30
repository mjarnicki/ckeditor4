( function() {

    function ckeckAndSetSortingDirection(table) {
        // By setting below attribute it is possible to save sorting direction in each table. 
        var sortingAttribute = 'data-sort-ascending'; 
    
        if(table.hasAttribute(sortingAttribute)) {
            table.removeAttribute(sortingAttribute);
            return false;
        } else {
            table.setAttribute(sortingAttribute, '');
            return true;
        }
    }
    
    function createArrayFromCellValue(value) {
        return value.trim().split(/([0-9,.]+)/).filter(elem => elem != '')
    }
    
    function isNumber(string) {
        // It was possible to check if string is a number inside a condition, but I decided to export it to a function in order to increase readability.
        return /^\d+$/.test(string);
    }

    function returnTableCell(editor) {
        // After sorting keyboard cursor is focused on 'body', so it is necessary to check and correct context of that cursor. 
        var startElement = editor.getSelection().getStartElement()

        if ( startElement.$.tagName === 'TBODY' ) {
            return startElement.getElementsByTag('td').getItem(0)
        } else {
            return startElement;
        }
    }

    function setStateOfIcon(editor) {
        var style = new CKEDITOR.style( { element: 'table' } ),
            command = editor.getCommand( 'tablesort' );

        editor.attachStyleStateChange( style, function( state ) {
            if ( state === 1 ){
                command.setState( CKEDITOR.TRISTATE_OFF )
            } else {
                command.setState( CKEDITOR.TRISTATE_DISABLED )
            }
        } );
    }

    var sortTable = {

        exec: function( editor ) {
            var tableCell = returnTableCell(editor),
                columnNumber = tableCell.getAscendant( { td:1 }, true ).getIndex(),
                table = tableCell.getAscendant({table:1}),
                tbody = table.getElementsByTag('tbody').getItem(0),
                items = tbody.$.childNodes,
                itemsArr = []
                isSortingAscending = ckeckAndSetSortingDirection(table);

            for ( var i in items ) {
                if ( items[i].nodeType == 1 && items[i].querySelector('td')) {
                    itemsArr.push(items[i]);		
                }
            }

            itemsArr.sort(function(a, b) {

                var aArray = createArrayFromCellValue(a.childNodes[columnNumber].innerText),
                    bArray = createArrayFromCellValue(b.childNodes[columnNumber].innerText);

                for (var i in aArray) {
                    
                    // Check if strings or numbers are equal. If yes, don't compare.
                    if ( aArray[i] !== bArray[i] && 
                        aArray[i] - bArray[i] !== 0 ) {

                        if ( isNumber(aArray[i]) && isNumber(bArray[i]) ) {
                            if ( isSortingAscending === true ) {
                                return aArray[i] - bArray[i]
                            }
                            else {
                                return bArray[i] - aArray[i]
                            }
                        } else {
                            if (isSortingAscending === true) {
                                return aArray[i].localeCompare(bArray[i], 'en-US-u-kf-upper')
                            } else {
                                return bArray[i].localeCompare(aArray[i], 'en-US-u-kf-upper')
                            }
                        }
                    }
                }
                return 0
            });

            for ( var i = 0; i < itemsArr.length; ++i ) {
                tbody.$.appendChild(itemsArr[i]);
            }

        },

        startDisabled: true
    }

    CKEDITOR.plugins.add( 'tablesort', {
        lang: 'en,pl',
        icons: 'tablesort',

        init: function( editor ) {

            editor.addCommand( 'tablesort', sortTable );

            setStateOfIcon(editor);

            editor.ui.addButton( 'TableSort', {
                label: editor.lang.tablesort.label,
                command: 'tablesort',
                toolbar: 'insert'
            });

            editor.setKeystroke( [
                [ CKEDITOR.CTRL + 40 /*↓*/, 'tablesort' ]
            ] );
        
        }
    });

} )();


