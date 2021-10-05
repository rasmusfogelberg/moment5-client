// Variables
let courseListEl = document.querySelector("#course-list");
let addCoursebtn = document.querySelector("#add-course");
let deleteCourseButtons;

const apiBaseURL = `http://api.fogelcode.com/moment5/api`;
const courseForm = document.querySelector("#course-form");

// Functions

/** 
 * List all courses in database
 *
 */
const getCourses = () => {
  courseListEl.innerHTML = "";
  deleteCourseButtons = document.querySelectorAll(".delete-course");

  fetch(`${apiBaseURL}/read.php`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((course) => {
        courseListEl.innerHTML += `
        <ul>
          <li><strong>Code:</strong></li>
          <li>${course.code}</li>
          <li><strong>Name:</strong></li>
          <li>${course.name}</li>
          <li><strong>Progression:</strong> ${course.progression}</li>
          <li><strong><a href="${course.course_syllabus}" title="${course.course_syllabus}">Course Syllabus</a></strong></li>
          <button class="delete-course" data-id="${course.id}">Delete</button>
        </ul>`;
      });
    })
    .catch((error) => console.log(`Error: ${error}`));
};

/** 
 * Delete a course
 *
 */

const deleteCourse = (id) => {
  fetch(`${apiBaseURL}/delete.php`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then(() => getCourses())
    .catch((error) => console.log(`Error: ${error}`));
};

/** 
 * Add a course
 *
 */

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


// Event listeners
window.addEventListener("load", getCourses);

// Prevent reload when submitting the form
courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // Construct a FormData object based on the inputs that live inside the form
  new FormData(courseForm);
});

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
    // Name attribute is "course-code". "course-code"  
    // needs to be removed, as API only accepts "code"
    let keyWithoutPrefix = key.replace("course-", "");

    // If a key has the string "syllabus" in it,
    // it will remake it to be "course_syllabus" since
    // this is what is used in the database
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
