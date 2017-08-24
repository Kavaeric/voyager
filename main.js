// main.js

/// Define distances ///
var distances = [];

/**
 * Adds a distance to the list of active ones.
 * @param {String} givenName - Name of the distance specified.
 * @param {Number} givenDist - Distance in meters.
 */
function addDistance(givenName, givenDist) {
    distances.push({'name': givenName,
                    'dist': givenDist});
}

// Default distances. Later, users may set something up on their own
addDistance('to Neptune',          4.332 * Math.pow(10, 12));
addDistance('to Proxima Centauri', 3.991 * Math.pow(10, 16));
addDistance('to Sirius',           8.128 * Math.pow(10, 16));
addDistance('to HIP 74995',        1.933 * Math.pow(10, 17));

console.log(distances);


/// Define speeds ///
var velocities = [];

/**
 * Adds a velocity to list of active ones.
 * @param {String} givenName - Name of the velocity unit specified.
 * @param {Number} givenSpeed - Speed in metres per second.
 */
function addVelocity(givenName, givenSpeed) {
    velocities.push({'name': givenName,
                     'speed': givenSpeed});
}

// Default speeds. Later, users may set something up on their own
addVelocity('times the speed of light (c)', 2.998 * Math.pow(10, 8));
addVelocity('Light years per hour (ly/h)',  2.628 * Math.pow(10, 12));
addVelocity('Parsecs per hour (pc/h)',      8.571 * Math.pow(10, 12));


/// Populate the panes ///
function populate() {
    // Populate distances
    for (var i = 0; i < distances.length; i++) {
        var newEntry = $('<div class="entry">'
        + '<span class="calc">Forever</span> <br>'
        + '<span class="desc">'  + distances[i]['name'] + '</span> </div>');

        $('#input_distance').append(newEntry);
    }

    // Populate velocities
    // Note how each entry has an ID equivalent to its position in the velocities array
    for (var i = 0; i < velocities.length; i++) {
        var newEntry = $('<div class="entry">'
        + '<input class="calc" type="number" value="0" min="0" maxlength="12" step="0.001" '
        + 'id="' + i
        + '"> <br>'
        + '<span class="desc">'  + velocities[i]['name'] + '</span> </div>');

        $('#input_velocity').append(newEntry);

        // Voyager will run calculations when a new value is inputted
        // Call a calculation to be run, and give a reference to the field making the call
        $('input.calc#' + i).on( 'input', function() { calculate( $(this) ) } );
    }
}

/// Beefy calculations ///
function calculate(selectedUnit) {
    // Get ID number
    var unitID = parseInt( $(selectedUnit).attr('id') );
    // Use the input value to get the equivalent speed in m/s
    var equivalentSpeed = $(selectedUnit).val() * velocities[unitID]['speed'];

    for (var i = 0; i < velocities.length; i++) {
        // Don't calculate for the unit used as the input
        if (i != unitID) {
            // Calculate the equivalent speed in the new units
            var newSpeed = equivalentSpeed / velocities[i]['speed'];

            // Assign the new value to the corresponding unit's input field
            $('input.calc#' + i).val(newSpeed.toFixed(3));
        }
    }
}


/// UI stuff ///
var btn_newton = $('.button.newton');
var btn_relat = $('.button.relat');
var btn_entries = $('.button.entries');
var btn_about = $('.button.about');

btn_newton.addClass('on');


/// Runtime ///
populate();