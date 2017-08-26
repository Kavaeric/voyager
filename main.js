// main.js

// Define the speed of light in m/s
var c = 299792458;

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
addDistance('to Tau Ceti',         1.124 * Math.pow(10, 17));
addDistance('to TRAPPIST-1',       3.731 * Math.pow(10, 17));
addDistance('to Polaris',          4.077 * Math.pow(10, 18));
addDistance('to M42 Orion Nebula', 1.513 * Math.pow(10, 19));
addDistance('to Sagittarius A*',   2.349 * Math.pow(10, 20));
addDistance('Milky Way diameter',  9.461 * Math.pow(10, 20));
addDistance('to M31 Andromeda',    2.433 * Math.pow(10, 22));

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
addVelocity('times the speed of light (c)', c);
addVelocity('Petametres per hour (Pm/h)',    2.778 * Math.pow(10, 11));
addVelocity('Exametres per hour (Em/h)',     2.778 * Math.pow(10, 12));
addVelocity('Light years per hour (ly/h)',   2.628 * Math.pow(10, 12));
addVelocity('Parsecs per hour (pc/h)',       8.571 * Math.pow(10, 12));
addVelocity('Light years per second (ly/s)', 9.461 * Math.pow(10, 15));
addVelocity('Parsecs per second (pc/s)',     3.086 * Math.pow(10, 16));

/// Populate the panes ///
function populate() {
    // Populate distances
    for (var i = 0; i < distances.length; i++) {
        var newEntry = $('<div class="entry dist">'
        + '<span '
        + 'class="' + i + '">Forever</span> <br>'
        + distances[i]['name'] + ' </div>');

        $('#input_distance').append(newEntry);
    }

    // Populate velocities
    // Each entry has an ID equivalent to its position in the velocities array
    for (var i = 0; i < velocities.length; i++) {
        var newEntry = $('<div class="entry velo">'
        + '<input type="number" value="0" min="0" maxlength="15" step="0.001" '
        + 'class="' + i + '"> <br>'
        + velocities[i]['name'] + '</div>');

        // Add entry into the list
        $('#input_velocity').append(newEntry);
    }
    //  Run calculations when the value is changed
    $('.entry.velo input').each( function() {
        // Call a calculation to be run, and give a reference to the field making the call
        $(this).on( 'input', function() { calculate( $(this) ) } );
        
        // Call for formatting when the user defocuses
        $(this).change( function() { formatNumber( $(this) ) } );
    });
}

/// Beefy calculations ///
function calculate(selectedUnit) {
    // Get ID number
    var unitNo = parseInt( $(selectedUnit).attr('class') );
    // Use the input value to get the equivalent speed in m/s
    var equivalentSpeed = $(selectedUnit).val() * velocities[unitNo]['speed'];

    // Convert to other units of speed
    for (var i = 0; i < velocities.length; i++) {
        // Don't need to calculate for the unit used as the input
        if (i != unitNo) {
            // Calculate the equivalent speed in the new units
            var newSpeed = equivalentSpeed / velocities[i]['speed'];

            // Assign the new value to the corresponding unit's input field
            $('.entry.velo input.' + i).val(newSpeed.toFixed(3));
        }
    }

    // Calculate travel times
    for (var i = 0; i < distances.length; i++) {
        // Calculate the equivalent speed in the new units
        var travelTime = distances[i]['dist'] / equivalentSpeed;
        var timeUnits = 'seconds';

        if (travelTime != Infinity) {
            // Begin making conversions to larger units
            if (travelTime <= 0.5) {
                // Convert to milliseconds
                travelTime *= 1000;
                timeUnits = 'milliseconds';
            }
            else if (travelTime > 60) {
                // Convert to minutes
                travelTime /= 60;
                timeUnits = 'minutes';

                if (travelTime > 60) {
                    // Convert to hours
                    travelTime /= 60;
                    timeUnits = 'hours';

                    if (travelTime > 24) {
                        // Convert to days
                        travelTime /= 24;
                        timeUnits = 'days';

                        if (travelTime > 365) {
                            // Convert to years
                            travelTime /= 365;
                            timeUnits = 'years';

                            if (travelTime > 1000) {
                                // Convert to millennia
                                travelTime /= 1000;
                                timeUnits = 'millennia'

                                if (travelTime > 1000) {
                                    // Convert to Myear or whatever
                                    travelTime /= 1000;
                                    timeUnits = 'Myear';

                                    // I'm not going any further than this
                                }
                            }
                        }
                    }
                }
            }
            // Assign the new value to the corresponding unit's input field
            $('.entry.dist span.' + i).text(travelTime.toFixed(3) + ' ' + timeUnits);
        }
        else {
            // [ECHOING] FOREVERRRR
            $('.entry.dist span.' + i).text('Forever');
        }
    }
}

// Formats numbers to three decimal places
function formatNumber(selectedUnit) {
    unitVal = parseFloat($(selectedUnit).val());

    $(selectedUnit).val( unitVal.toFixed(3) );
}


/// UI stuff ///
var btn_newton = $('.button.newton');
var btn_relat = $('.button.relat');
var btn_entries = $('.button.entries');
var btn_about = $('.button.about');

btn_newton.addClass('on');


/// Runtime ///
populate();