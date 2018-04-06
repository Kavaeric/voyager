// entries.js

//           DATABASE ENTRIES           //
//--------------------------------------//
//  Allows the user to input and edit   //
//     custom distances and speeds      //


/// UI stuff ///
var btn_dist = $('#dbNavbar .button.dist');
var btn_velo = $('#dbNavbar .button.velo');

function dbSwitchMenu(selectedButton) {
    // Turn off all the buttons...
    $('#dbNavbar > .button').removeClass('on');
    // ...except for the one clicked
    $(selectedButton).addClass('on');

    // Show corresponding menus
    if (selectedButton.hasClass('dist')) {
        $('.entryMode').hide();
        $('.entryMode.entryDist').show();
    }
    else if (selectedButton.hasClass('velo')) {
        $('.entryMode').each( function () {$(this).hide()} );
        $('.entryMode.entryVelo').show();
    }
}

// Select the Distance pane by default
dbSwitchMenu(btn_dist);

// Attach the listener for the navbar buttons
$('#dbNavbar').on('click', '.button', function() {
    dbSwitchMenu($(this) )
});

// Flag if an entry is being edited or not
var editing = false;

// Deleting entries
function deleteEntry(selectedEntry, entryIndex) {

    $(selectedEntry).remove();

    // Remove the entry from the array list
    if ($(selectedEntry).hasClass('dist')) {
        console.log('Delete Entry: Deleting distance [' + distances[entryIndex]['name'] + ']')
        distances.splice(entryIndex, 1);
    }
    //else if ($(selectedEntry).hasClass('velo')) {
    //    console.log('Delete Entry: Deleting velocity unit [' + velocities[entryIndex]['name'] + ']')
    //    velocities.splice(entryIndex, 1);
    //}

    cancelEntry();
    populateNewton();
}

/**
 * Import CSV to replace distances
 */
function importEntries() {
    var uploadedFile = document.getElementById('distImport').files[0];

    // 'cause it WILL overwrite them
    if (!confirm('Overwrite current distances?')) {
        return null;
    }

    // Read the CSV and replace the current set of distances
    var reader = new FileReader();
    
    // Set up a function for what happens when a file is read
    reader.onload = function (event) {
        var readCSV = $.csv.toArrays(reader.result);

        // Reset distance array
        distances = [];

        // Check if given distance value is actually a number
        for (var i = 0; i < readCSV.length; i++) {
            if(isNaN(readCSV[i][1])) {
                alert('importEntries: Distance given for [' + readCSV[i][0] + '] is not a number. Defaulting to 1000 m.');
                console.warn('importEntries: Distance given for [' + readCSV[i][1] + '] is not a number. Defaulting to 1000 m.');
                readCSV[i][1] = 1000;
            }
            addDistance(readCSV[i][0], readCSV[i][2], readCSV[i][3]);
        }

        // Remember to populate everything
        populateDB();
        populateNewton();

        // And cancel the editing pane
        cancelEntry();
    }

    // Actually read the file, damn it
    reader.readAsText(uploadedFile);
}

// Import button
$('#distImport').on('change', function() {
    importEntries();
});

/**
 * Exports currently used entries into a .CSV file
 */
function exportEntries() {
    // Compile the data
    var compiledCSV = '';

    if (distances.length < 1) {
        return null;
    }

    for (var i = 0; i < distances.length; i++) {
        compiledCSV += distances[i]['name'] + ','
                     + distances[i]['dist'] + ','
                     + distances[i]['givenDist'] + ','
                     + distances[i]['givenUnit'];

        if (i != distances.length) {
            compiledCSV += '\n';
        }
    }

    // It shall be a CSV
    var compiledCSV = 'data:text/csv;charset=utf-8,' + compiledCSV;

    console.log(compiledCSV);

    csvFile = encodeURI(compiledCSV);

    // Create a temporary link to the generated file, then activate said link
    var link = $('<a>', {id: 'fileLink', href: csvFile, download: 'Voyager Distances.csv'});
    $('body').append(link);
    document.getElementById('fileLink').click()

    // Probs can remove this link after we're done
    link.remove();
}

// Export button
$('#dbDist .buttonRow .button.export').on('click', function() {
    exportEntries();
});

// Adding new entries from the pane
function saveEntry() {
    var name = $('#dbDistEditEntry input[name="name"]').val();
    var dist = $('#dbDistEditEntry input[name="dist"]').val();
    var unit = $('#dbDistEditEntry select[name="unit"]').val();

    if (name.length < 1) {
        name = 'Arbitrary Distance';
    }

    if (dist.length < 1) {
        dist = 1;
    }
    
    if (editing) {
        // Delete the old entry to be replaced with the new one
        deleteEntry($('#dbDist .dbList .entry.dist.on'), $('#dbDist .dbList .entry.dist.on').index());

        editing = false;
        $('#dbDistEditEntry h1').text('Create Distance');

        cancelEntry();
    }

    // Add the new distance with the given values
    addDistance(name, dist, unit);
    console.log('Add Entry: Adding distance [' + name + ']')

    populateDB();
    populateNewton();
}

// Clears the entry pane
function cancelEntry() {
    editing = false;
    $('#dbDistEditEntry h1').text('Create Distance');
    $('#dbDistEditEntry input[name="name"]').val('');
    $('#dbDistEditEntry input[name="dist"]').val('');
    $('#dbDistEditEntry select[name="unit"]').val('au');

    $('#dbDist .dbList .entry.dist').removeClass('on');
}

// Sets up editing of an existing entry
function editEntry(selectedEntry, entryIndex) {
    editing = true;
    $('#dbDistEditEntry h1').text('Edit Distance');

    $('#dbDist .dbList .entry.dist').removeClass('on');
    $(selectedEntry).addClass('on');

    $('#dbDistEditEntry input[name="name"]').val(distances[entryIndex]['name']);
    $('#dbDistEditEntry input[name="dist"]').val(distances[entryIndex]['givenDist']);
    $('#dbDistEditEntry select[name="unit"]').val(distances[entryIndex]['givenUnit']);
}

/// Populate the list ///
function populateDB() {
    // Delete all entries first
    $('#dbDist .dbList').empty();
    $('#dbVelo .dbList').empty();

    // Populate distances
    for (var i = 0; i < distances.length; i++) {
        var newEntry = $('<div class="entry dist"><span>'
        + distances[i]['name']
        + '</span><div class="button"></div>'
        + '</div>');

        $('#dbDist .dbList').append(newEntry);
    }

    // Populate velocities
    for (var i = 0; i < velocities.length; i++) {
        var newEntry = $('<div class="entry velo"><span>'
        + velocities[i]['unit']
        + '</span><div class="button"></div>'
        + '</div>');

        $('#dbVelo .dbList').append(newEntry);
    }

    // Add a listener to edit each entry
    // The listener is delegated to the span element so that it is not
    // triggered when clicking on the delete button
    $('#dbDist .dbList .entry.dist span').click(function() {
        editEntry($(this).parent(), $(this).parent().index());
    });
    $('#dbVelo .dbList').on('click', '.entry.velo span', function() {
        // editEntry($(this), $(this).index());
    });

    // Make the delete buttons...delete
    $('#dbDist .dbList .entry.dist .button').click(function() {
        deleteEntry($(this).parent(), $(this).parent().index());
    });
    $('#dbVelo .dbList').on('click', '.entry.velo .button', function() {
        //deleteEntry($(this).parent(), $(this).parent().index());
    });
}

// Make the save button...save
$('#dbDistEditEntry .buttonRow .button.save').on('click', function() {
    if (!$('#dbDistEditEntry input[name="dist"]').is(':invalid')) {
        saveEntry();
    }
    else {
        $('#dbDistEditEntry input[name="dist"]').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }
});

// Make the cancel...ah, whatever
$('#dbDistEditEntry .buttonRow .button.cancel').on('click', function() {
    cancelEntry();
});

/// First run ///
$(document).ready(function(){
    cancelEntry();
    populateDB();
});
