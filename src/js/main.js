"use strict";

// Variables
let courseListEl = document.getElementById("course-list");
let addCoursebtn = document.getElementById("add-Course");
let codeInput = document.getElementById("course-code");
let nameInput = document.getElementById("course-name");
let progressionInput = document.getElementById("course-progression");
let syllabusInput = document.getElementById("course-syllabus");

// Functions
let getCourses = () => {
  courseListEl.innerHTML = "";

  fetch("http://api.fogelcode.com/moment5/api/read.php")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((course) => {
        courseListEl.innerHTML += `
        <li><strong>Code:</strong> ${course.code}</li>
        <li><strong>Name:</strong> ${course.name}</li>
        <li><strong>Progression:</strong> ${course.progression}</li>
        <li><strong><a href="${course.course_syllabus}" title="${course.course_syllabus}">Course Syllabus</a></strong></li>
        <button id="${course.id}" onClick="deleteCourse(${course.id})">Delete</button>
        <br>
        `;
      });
    });
};

let deleteCourse = (id) => {
  fetch(`http://api.fogelcode.com/moment5/api/delete.php?id=${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      getCourses();
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
};

let addCourse = () => {
  let code = codeInput.value;
  let name = nameInput.value;
  let progression = progressionInput.value;
  let syllabus = syllabusInput.value;

  let course = {
    code: code,
    name: name,
    progression: progression,
    syllabus: syllabus,
  };

  fetch(`http://api.fogelcode.com/moment5/api/create.php`, {
    method: "POST",
    body: json.stringify(course),
  })
    .then((response) => response.json())
    .then((data) => {
      getCourses();
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
};

/**
 * TODO: Solve this so I can have event listeners first
 * If the event listeners is before the functions I get error message:
 * "Uncaught ReferenceError: Cannot access 'getCourses' before initialization"
 **/

// Event listeners
window.addEventListener("load", getCourses);
addCoursebtn.addEventListener("click", addCourse);
