var _ = require('underscore');

var students = JSON.parse(require('fs').readFileSync('./students.json'));

var classes = [];

students.forEach(student => {
  var number = student.curriculum.number;

  var classes = _.groupBy(student.students, 'classNumber');

  for (var classNumber in classes) {
    var teacherName = classes[classNumber][0].teacherName.replace(/等$/, '');

    console.log("INSERT INTO classes (trid, cid, number, fid, created_at, updated_at) VALUES (7, "
      + "(SELECT cid FROM curriculums WHERE curriculums.number = '" + number + "'), "
      + "'" + classNumber + "', "
      + "(SELECT fid FROM faculties WHERE faculties.name = '" + teacherName + "'), NOW(), NOW());");
  }
});
