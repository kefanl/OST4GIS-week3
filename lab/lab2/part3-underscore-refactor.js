(function(){

  var map = L.map('map', {
    center: [39.9522, -75.1639],
    zoom: 14
  });
  var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  /* =====================

  # Lab 2, Part 4 — (Optional, stretch goal)

  ## Introduction

    You've already seen this file organized and refactored. In this lab, you will
    try to refactor this code to be cleaner and clearer - you should use the
    utilities and functions provided by underscore.js. Eliminate loops where possible.

  ===================== */

  // Mock user input
  // Filter out according to these zip codes:
  var acceptedZipcodes = [19106, 19107, 19124, 19111, 19118];
  // Filter according to enrollment that is greater than this variable:
  var minEnrollment = 300;


  // clean data
_.forEach(schools,function(sch){
  if (typeof sch.ZIPCODE === 'string') {
    split = sch.ZIPCODE.split(' ');
    normalized_zip = parseInt(split[0]);
    sch.ZIPCODE = normalized_zip;
  }
  if (typeof sch.GRADE_ORG === 'number') {  // if number
    sch.HAS_KINDERGARTEN = sch.GRADE_LEVEL < 1;
    sch.HAS_ELEMENTARY = 1 < sch.GRADE_LEVEL < 6;
    sch.HAS_MIDDLE_SCHOOL = 5 < sch.GRADE_LEVEL < 9;
    sch.HAS_HIGH_SCHOOL = 8 < sch.GRADE_LEVEL < 13;
  } else {  // otherwise (in case of string)
    sch.HAS_KINDERGARTEN = sch.GRADE_LEVEL.toUpperCase().indexOf('K') >= 0;
    sch.HAS_ELEMENTARY = sch.GRADE_LEVEL.toUpperCase().indexOf('ELEM') >= 0;
    sch.HAS_MIDDLE_SCHOOL = sch.GRADE_LEVEL.toUpperCase().indexOf('MID') >= 0;
    sch.HAS_HIGH_SCHOOL = sch.GRADE_LEVEL.toUpperCase().indexOf('HIGH') >= 0;
  }
  return sch
})

  // filter data
  var filtered_data = [];
  var filtered_out = [];
_.forEach(schools,function(sch){
    isOpen = sch.ACTIVE.toUpperCase() == 'OPEN';
    isPublic = (sch.TYPE.toUpperCase() !== 'CHARTER' ||
                sch.TYPE.toUpperCase() !== 'PRIVATE');
    isSchool = (sch.HAS_KINDERGARTEN ||
                sch.HAS_ELEMENTARY ||
                sch.HAS_MIDDLE_SCHOOL ||
                sch.HAS_HIGH_SCHOOL);
    meetsMinimumEnrollment = sch.ENROLLMENT > minEnrollment;
    meetsZipCondition = acceptedZipcodes.indexOf(sch.ZIPCODE) >= 0;
    filter_condition = (isOpen &&
                        isSchool &&
                        meetsMinimumEnrollment &&
                        !meetsZipCondition);

    if (filter_condition) {
      filtered_data.push(sch);
    } else {
      filtered_out.push(sch);
    }
  })
  console.log('Included:', filtered_data.length);
  console.log('Excluded:', filtered_out.length);

  // main loop
  var color;
  _.forEach(filtered_data,function(sch){
    isOpen = sch.ACTIVE.toUpperCase() == 'OPEN';
    isPublic = (sch.TYPE.toUpperCase() !== 'CHARTER' ||
                sch.TYPE.toUpperCase() !== 'PRIVATE');
    meetsMinimumEnrollment = sch.ENROLLMENT > minEnrollment;

    // Constructing the styling  options for our map
    if (sch.HAS_HIGH_SCHOOL){
      color = '#0000FF';
    } else if (sch.HAS_MIDDLE_SCHOOL) {
      color = '#00FF00';
    } else {
      color = '##FF0000';
    }
    // The style options
    var pathOpts = {'radius': sch.ENROLLMENT / 30,
                    'fillColor': color};
    L.circleMarker([sch.Y, sch.X], pathOpts)
      .bindPopup(sch.FACILNAME_LABEL)
      .addTo(map);
  })


})();
