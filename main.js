// main.js

// Define the speed of light in m/s
const c = 299792458;

// Define a light-year in m
const ly = 9460730472580800 ;

// Define an astronomical unit in m
const au = 149597870700;

// Define a parsec in m (IAU 2015 Resolution B2)
const pc = (648000 / Math.PI) * au;


/// Define distances ///
var distances = [];

/**
 * Adds a distance to the list of active ones.
 * @param {String} givenName Name of the distance specified.
 * @param {Number} givenDist Distance in meters.
 * @param {String} givenUnit Given units. "ly" "au" "pc" "Pm" "Em" accepted.
 */
function addDistance(givenName, givenDist, givenUnit) {
    // calcDist will store the calculated distance after conversion is done
    var calcDist;

    // Convert the given distance to metres
    switch (givenUnit) {
        // Light-year
        case "ly":
            calcDist = givenDist * ly;
            break;

        // Astronomical unit
        case "au":
            calcDist = givenDist * au;
            break;

        // Parsec
        case "pc":
            calcDist = givenDist * pc;
            break;

        // Petametre
        case "Pm":
            calcDist = givenDist * Math.pow(10, 15);
            break;

        // Exametre
        case "Em":
            calcDist = givenDist * Math.pow(10, 18);
            break;

        // If an invalid unit is given, assume metres
        default:
            console.warn('importEntries: ');
            calcDist = givenDist;
    }
    
    distances.push({'name': givenName,
                    'dist': calcDist,
                    'givenDist': givenDist,
                    'givenUnit': givenUnit});

    // Sort the new array by distance
    distances.sort( function(a, b) {
        return a.dist - b.dist;
    });
}

// Default distances
addDistance('to Neptune',            30.110387, "au");
addDistance('to Proxima Centauri',       4.246, "ly");
addDistance('to Tau Ceti',              11.905, "ly");
addDistance('to TRAPPIST-1',            39.5  , "ly");
addDistance('to Polaris',              378    , "ly");
addDistance('to M42 Orion Nebula',    1344    , "ly");
addDistance('to Sagittarius A*',      7611    , "pc");
addDistance('Milky Way diameter',   100000    , "ly");
addDistance('to M31 Andromeda',     788300    , "pc");
addDistance('Observable universe', 93000000000, "ly");

console.log(distances);


/// Define speeds ///
var velocities = [];

/**
 * Adds a velocity to list of active ones.
 * @param {String} givenName - Name of the velocity unit specified.
 * @param {Number} givenSpeed - Speed in metres per second.
 */
function addVelocity(givenName, givenShortName, givenSpeed) {
    velocities.push({'name': givenName,
                     'unit': givenShortName,
                     'speed': givenSpeed});
}

// Default speeds. Later, users may set something up on their own
addVelocity('times the speed of light', 'c'   , c);
addVelocity('Petametres per hour'     , 'PM/h', 2.778 * Math.pow(10, 11));
addVelocity('Exametres per hour'      , 'Em/h', 2.778 * Math.pow(10, 14));
addVelocity('Light years per hour'    , 'ly/h', 2.628 * Math.pow(10, 12));
addVelocity('Parsecs per hour'        , 'pc/h', 8.571 * Math.pow(10, 12));
addVelocity('Light years per second'  , 'ly/s', 9.461 * Math.pow(10, 15));
addVelocity('Parsecs per second'      , 'pc/s', 3.086 * Math.pow(10, 16));

/// UI stuff ///
var btn_newton = $('.button.newton');
var btn_relat = $('.button.relat');
var btn_entries = $('.button.entries');
var btn_about = $('.button.about');

function switchMenu(selectedButton) {
    // Turn off all the buttons...
    $('.sidebar > .button').removeClass('on');
    // ...except for the one clicked
    $(selectedButton).addClass('on');

    // Show corresponding menus
    if (selectedButton.hasClass('newton')) {
        $('.mode').each( function () {$(this).hide()} );
        $('.mode.newton').show();
    }
    else if (selectedButton.hasClass('relat')) {
        $('.mode').each( function () {$(this).hide()} );
        $('.mode.relat').show();
    }
    else if (selectedButton.hasClass('entries')) {
        $('.mode').each( function () {$(this).hide()} );
        $('.mode.entries').show();
    }
    else if (selectedButton.hasClass('about')) {
        $('.mode').each( function () {$(this).hide()} );
        $('.mode.about').show();
    }
}

// Select the Newtonian calculator by default
switchMenu(btn_newton);

// Attach listener to all buttons
$('.sidebar').on('click', '.button', function() {
    switchMenu($(this) )
});
