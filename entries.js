// entries.js

//           DATABASE ENTRIES           //
//--------------------------------------//
//  Allows the user to input and edit   //
//     custom distances and speeds      //

// Deleting entries
function deleteEntry(selectedEntry, entryIndex) {
    console.log(distances[entryIndex]['name']);
    $(selectedEntry).remove();

    // Remove the entry from the array list
    distances.splice(entryIndex, 1);

    populateDB();
    populateNewton();
}

// Adding new entries from the pane
function saveEntry() {
    var name = $('#dbDistAddEntry input[name="name"]').val();
    var dist = $('#dbDistAddEntry input[name="dist"]').val();
    var unit = $('#dbDistAddEntry select[name="unit"]').val();

    if (name.length < 1) {
        name = 'Arbitrary Distance';
    }

    if (dist.length < 1) {
        dist = 1;
    }

    addDistance(name, dist, unit);

    populateDB();
    populateNewton();
}

// Clears the entry pane
function cancelEntry() {
    var name = $('#dbDistAddEntry input[name="name"]').val('');
    var dist = $('#dbDistAddEntry input[name="dist"]').val('');
    var unit = $('#dbDistAddEntry select[name="unit"]').val('au');
}

/// Populate the list ///
function populateDB() {
    // Delete all entries first
    $('#dbDist').empty();

    // Populate distances
    for (var i = 0; i < distances.length; i++) {
        var newEntry = $('<div class="entry dist"><span>'
        + distances[i]['name']
        + '</span><div class="button"></div>'
        + '</div>');

        $('#dbDist').append(newEntry);
    }

    // Make the delete buttons...delete
    $('#dbDist').on('click', '.button', function() {
        deleteEntry($(this).parent(), $(this).parent().index())
    });
}

// Disable save button when the number field doesn't have a number
$('#dbDistAddEntry input[name="dist"]').on('input', function() {
    if ($(this).is(':invalid')) {
        console.log('invalid');
        $('#dbDistAddEntry .button.save').addClass("disabled");
    }
});

// Make the save button...save
$('#dbDistAddEntry .button.save').on('click', function() {
    if (!$('#dbDistAddEntry input[name="dist"]').is(':invalid')) {
        saveEntry();
    }
    else {
        $('#dbDistAddEntry input[name="dist"]').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }
});

// Make the cancel...ah, whatever
$('#dbDistAddEntry .button.cancel').on('click', function() {
    cancelEntry();
});


/// First run ///
$(document).ready(function(){
    populateDB();
});
