CKEDITOR.plugins.add( 'tablesort', {
    lang: 'en,pl',
    icons: 'tablesort',

    init: function( editor ) {

        var sortAscending = true;

        editor.addCommand( 'sortTable', {
            exec: function( editor ) {

                sortTable(sortAscending)
                sortAscending = !sortAscending;

            }
        });

        editor.ui.addButton( 'TableSort', {
            label: editor.lang.tablesort.label,
            command: 'sortTable',
            toolbar: 'insert'
        });

        var sortTable = function( sortAscending ){
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if ( element ){
                var columnNumber = element.getAscendant( { td:1 }, true ).getIndex();
                var table = element.getAscendant({table:1});
                var tbody = table.getElementsByTag('tbody').getItem(0);

                if(tbody == undefined) tbody = table;

                var items = tbody.$.childNodes;
                var itemsArr = [];
                for (var i in items) {
                    if (items[i].nodeType == 1)
                        itemsArr.push(items[i]);		
                }

                itemsArr.sort(function(a, b) {

                    var aValue = a.childNodes[columnNumber].innerText.trim(); 
                    var bValue = b.childNodes[columnNumber].innerText.trim(); 
                    
                    var aArray = aValue.split(/([0-9,.]+)/).filter(elem => elem != '')
                    var bArray = bValue.split(/([0-9,.]+)/).filter(elem => elem != '')


                    for (var i in aArray) {
                        // Check if strings or numbers are equal. If yes, don't compare.
                        if(aArray[i] != bArray[i] && aArray[i] - bArray[i] != 0) {

                            if(aArray[i]-0 + '' === 'NaN' && bArray[i]-0 + '' === 'NaN') {
                                
                                if(sortAscending === true) {
                                    return aArray[i].localeCompare(bArray[i], 'en-US-u-kf-upper')
                                } else {
                                    return bArray[i].localeCompare(aArray[i], 'en-US-u-kf-upper')
                                }

                            } else {
                                if(sortAscending === true) {
                                        return aArray[i] - bArray[i]
                                    }
                                else {
                                    return bArray[i] - aArray[i]
                                }
                            }
                        }
                    }
                });

                for (i = 0; i < itemsArr.length; ++i) {
                  tbody.$.appendChild(itemsArr[i]);
                }
            }
        }
    }
});