// newton.js

//         NEWTONIAN CALCULATOR         //
//--------------------------------------//
// Calculates superluminal travel times //
//      using classical mechanics       //

/// Populate the panes ///
function populateNewton() {
    // Delete all entries first
    $('#inputDist').empty();
    $('#inputVelo').empty();    

     // Populate distances
    for (var i = 0; i < distances.length; i++) {
        var newEntry = $('<div class="entry dist"> <span>Forever</span><br> <span>'
        + distances[i]['name'] + '</span></div>');

        $('#inputDist').append(newEntry);
    }

    // Populate velocities
    // Each entry has an ID equivalent to its position in the velocities array
    for (var i = 0; i < velocities.length; i++) {
        var newEntry = $('<div class="entry velo">'
        + '<input type="number" value="0" min="0" maxlength="15" step="0.001"><br>'
        + velocities[i]['name'] + '</div>');

        // Add entry into the list
        $('#inputVelo').append(newEntry);
    }
    // Run calculations when the value is changed
    $('#inputVelo').on( 'input', '.entry.velo > input', function () {
        calculateNewton($(this), $(this).parent().index())
    } );
    
    // Call for formatting when the user defocuses
    $('#inputVelo').on( 'change', '.entry.velo > input', function () {
        formatNumber($(this));
    } );
}

// Beefy calculations 
function calculateNewton(selectedUnit, unitIndex) {
    // Use the input value to get the equivalent speed in m/s
    var equivalentSpeed = $(selectedUnit).val() * velocities[unitIndex]['speed'];

    // Convert to other units of speed
    for (var i = 0; i < velocities.length; i++) {
        // Don't need to calculate for the unit used as the input
        if (i != unitIndex) {
            // Calculate the equivalent speed in the new units
            var newSpeed = equivalentSpeed / velocities[i]['speed'];

            // Assign the new value to the corresponding unit's input field
            $('#inputVelo .entry.velo:nth-child(' + (i+1) +  ') input').val(newSpeed.toFixed(3));
        }
    }

    // Calculate travel times
    for (var i = 0; i < distances.length; i++) {
        // Calculate the equivalent speed in the new units
        var travelTime = distances[i]['dist'] / equivalentSpeed;
        var timeUnits = 'seconds';

        if (travelTime != Infinity) {
            // Begin making conversions to larger units
            if (travelTime < 1) {
                // Convert to milliseconds
                travelTime *= 1000;
                timeUnits = 'milliseconds';

                if (travelTime < 1) {
                    // Convert to microseconds
                    travelTime *= 1000;
                    timeUnits = 'microseconds';

                    if (travelTime < 1) {
                        // Convert to nanoseconds
                        travelTime *= 1000;
                        timeUnits = 'nanoseconds';
                    }
                }
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
                                // Convert to kyear
                                travelTime /= 1000;
                                timeUnits = 'kyear'

                                // I'm not going any further than this

                                if (travelTime > 1000) {
                                    // Convert to Myear
                                    travelTime /= 1000;
                                    timeUnits = 'Myear';

                                    // *Ahem*
                                }
                            }
                        }
                    }
                }
            }
            // Assign the new value to the corresponding unit's input field
            $('.mode.newton .entry.dist:nth-child(' + (i+1) + ') span:first-child').text(travelTime.toFixed(3) + ' ' + timeUnits);
        }
        else {
            // If the input is 0 then it'll take FOREVER
            if (Math.floor(Math.random() * 700) != 0) {
                $('#inputDist .entry.dist:nth-child(' + (i+1) + ') span:first-child').text('Forever');
            }
            else {
                $('#inputDist .entry.dist:nth-child(' + (i+1) + ') span:first-child').html( novelty[Math.floor(Math.random() * novelty.length)] )
            }
        }
    }
}

// Formats numbers to three decimal places
function formatNumber(selectedUnit) {
    unitVal = parseFloat($(selectedUnit).val());

    $(selectedUnit).val( unitVal.toFixed(3) );
}

/// First run ///
$(document).ready(function(){
    populateNewton();
});
