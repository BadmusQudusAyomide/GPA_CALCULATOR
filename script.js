const courseForm = document.getElementById("course-form");
const courseList = document.getElementById("courses-list");
const gpaSpan = document.getElementById("gpa");

let courses = [];

// Load courses from cookies on page load
function loadCourses() {
  const cookieData = document.cookie
    .split(";")
    .find((cookie) => cookie.startsWith("courses="));
  if (cookieData) {
    courses = JSON.parse(cookieData.split("=")[1]);
  }
}

loadCourses();

// Function to add a new course
function addCourse(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const courseName = document.getElementById("course-name").value.trim();
  const courseGrade = document.getElementById("course-grade").value;
  const courseUnit = parseInt(document.getElementById("course-unit").value);

  if (!courseName) {
    alert("Please enter a course name!");
    return;
  }

  if (isNaN(courseUnit) || courseUnit <= 0) {
    alert("Please enter a valid course unit (positive number)!");
    return;
  }

  const newCourse = { name: courseName, grade: courseGrade, unit: courseUnit };
  courses.push(newCourse);

  renderCourses();
  saveCourses();

  document.getElementById("course-name").value = ""; // Clear input fields after adding
  document.getElementById("course-unit").value = "";
}

// Function to remove a course from the list
function removeCourse(courseIndex) {
  courses.splice(courseIndex, 1);
  renderCourses();
  saveCourses();
}

// Function to calculate and display the GPA
function calculateGPA() {
  if (courses.length === 0) {
    gpaSpan.textContent = "No courses added yet.";
    return;
  }

  let totalQualityPoints = 0;
  let totalUnits = 0;
  for (const course of courses) {
    switch (course.grade) {
      case "A":
        totalQualityPoints += 5 * course.unit;
        break;
      case "B":
        totalQualityPoints += 4 * course.unit;
        break;
      case "C":
        totalQualityPoints += 3 * course.unit;
        break;
      case "D":
        totalQualityPoints += 2 * course.unit;
        break;
      case "E":
        totalQualityPoints += 1 * course.unit;
        break;
      default:
        totalQualityPoints += 0;
    }
    totalUnits += course.unit;
  }

  const gpa = totalQualityPoints / totalUnits;
  gpaSpan.textContent = gpa.toFixed(2);
}

// Function to render the list of courses
function renderCourses() {
  courseList.innerHTML = ""; // Clear existing list items

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const listItem = document.createElement("li");
    listItem.textContent = `${course.name} - ${course.grade} (${course.unit} units)`;

    const removeSpan = document.createElement("span");
    removeSpan.classList.add("remove");
    removeSpan.textContent = "❌";
    removeSpan.addEventListener("click", () => removeCourse(i));

    listItem.appendChild(removeSpan);
    courseList.appendChild(listItem);
  }

  calculateGPA();
}

// Function to save courses to cookies
function saveCourses() {
  const coursesJson = JSON.stringify(courses);
  document.cookie = `courses=${coursesJson}`;
}

courseForm.addEventListener("submit", addCourse);
