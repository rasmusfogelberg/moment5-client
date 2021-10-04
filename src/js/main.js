// Variables
let courseListEl = document.querySelector("#course-list");
let addCoursebtn = document.querySelector("#add-course");
let deleteCourseButtons;

const apiBaseURL = `http://api.fogelcode.com/moment5/api`;
const courseForm = document.querySelector("#course-form");

// Functions
const getCourses = () => {
  courseListEl.innerHTML = "";
  deleteCourseButtons = document.querySelectorAll(".delete-course");

  fetch(`${apiBaseURL}/read.php`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((course) => {
        courseListEl.innerHTML += `
        <li><strong>Code:</strong> ${course.code}</li>
        <li><strong>Name:</strong> ${course.name}</li>
        <li><strong>Progression:</strong> ${course.progression}</li>
        <li><strong><a href="${course.course_syllabus}" title="${course.course_syllabus}">Course Syllabus</a></strong></li>
        <button class="delete-course" data-id="${course.id}">Delete</button>
        `;
      });
    });
  // TODO: Awlays handle error!
};

const deleteCourse = (id) => {
  console.log("HELLO", id);
  fetch(`${apiBaseURL}/delete.php?id=${id}`, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(`Error: ${error}`);
    })
    .finally(getCourses());
};

const addCourse = (course) => {
  fetch(`${apiBaseURL}/create.php`, {
    method: "POST",
    body: JSON.stringify(course),
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

// Prevent reload when submitting the form
courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // Construct a FormData object based on the inputs that live inside the form
  new FormData(courseForm);
});

//
courseForm.addEventListener("formdata", (event) => {
  const data = event.formData; // FormData-> .get()
  const course = {};

  /**
   * data.keys() will contain an array
   * of all the keys inside the formData.
   * This will get their values from the
   * fields that live inside the form.
   **/
  for (let key of data.keys()) {
    // Example of why this is needed:
    // Name attribute is "course-code" we need to
    // remove "course-", as API only accepts "code"
    let keyWithoutPrefix = key.replace("course-", "");

    if (keyWithoutPrefix === "syllabus") {
      keyWithoutPrefix = `course_syllabus`;
    }

    course[keyWithoutPrefix] = data.get(key);
  }

  addCourse(course);
});

document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-course")) {
    console.log("Clicked a delete button!", event.target);
    deleteCourse(event.target.dataset.id);
  }
});
