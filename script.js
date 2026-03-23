const courseForm = document.getElementById("course-form");
const courseList = document.getElementById("courses-list");
const gpaSpan = document.getElementById("gpa");
const gradingScaleSelect = document.getElementById("grading-scale");
const scaleDescription = document.getElementById("scale-description");

let courses = [];
let gradingScale = "5";

const GRADE_POINTS = {
  "5": { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 },
  "4": { A: 4, B: 3, C: 2, D: 1, E: 0, F: 0 },
};

function getStoredData() {
  const cookieData = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("gpaData="));

  if (!cookieData) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(cookieData.split("=")[1]));
  } catch (error) {
    return null;
  }
}

function loadSavedData() {
  const savedData = getStoredData();

  if (!savedData) {
    return;
  }

  if (savedData.gradingScale === "4" || savedData.gradingScale === "5") {
    gradingScale = savedData.gradingScale;
  }

  if (!Array.isArray(savedData.courses)) {
    return;
  }

  courses = savedData.courses
    .filter(
      (course) =>
        course &&
        typeof course.name === "string" &&
        typeof course.grade === "string" &&
        Number.isFinite(Number(course.unit)) &&
        Number(course.unit) > 0
    )
    .map((course) => ({
      name: course.name.trim(),
      grade: course.grade,
      unit: Number(course.unit),
    }));
}

function updateScaleDescription() {
  const descriptions = {
    "5": "5.0 scale: A=5, B=4, C=3, D=2, E=1, F=0",
    "4": "4.0 scale: A=4, B=3, C=2, D=1, E=0, F=0",
  };

  scaleDescription.textContent = descriptions[gradingScale];
}

function saveCourses() {
  const savedData = encodeURIComponent(
    JSON.stringify({ courses, gradingScale })
  );
  document.cookie = `gpaData=${savedData}; path=/; max-age=31536000; SameSite=Lax`;
}

function addCourse(event) {
  event.preventDefault();

  const courseName = document.getElementById("course-name").value.trim();
  const courseGrade = document.getElementById("course-grade").value;
  const courseUnit = Number.parseInt(
    document.getElementById("course-unit").value,
    10
  );

  if (!courseName) {
    alert("Please enter a course name.");
    return;
  }

  if (Number.isNaN(courseUnit) || courseUnit <= 0) {
    alert("Please enter a valid course unit.");
    return;
  }

  courses.push({ name: courseName, grade: courseGrade, unit: courseUnit });

  renderCourses();
  saveCourses();

  document.getElementById("course-name").value = "";
  document.getElementById("course-unit").value = "";
}

function removeCourse(courseIndex) {
  courses.splice(courseIndex, 1);
  renderCourses();
  saveCourses();
}

function calculateGPA() {
  if (courses.length === 0) {
    gpaSpan.textContent = "No courses added yet.";
    return;
  }

  const activeScale = GRADE_POINTS[gradingScale];
  let totalQualityPoints = 0;
  let totalUnits = 0;

  for (const course of courses) {
    const gradePoint = activeScale[course.grade] ?? 0;
    totalQualityPoints += gradePoint * course.unit;
    totalUnits += course.unit;
  }

  const gpa = totalQualityPoints / totalUnits;
  gpaSpan.textContent = gpa.toFixed(2);
}

function renderCourses() {
  courseList.innerHTML = "";

  for (let i = 0; i < courses.length; i += 1) {
    const course = courses[i];
    const listItem = document.createElement("li");
    listItem.textContent = `${course.name} - ${course.grade} (${course.unit} units)`;

    const removeSpan = document.createElement("span");
    removeSpan.classList.add("remove");
    removeSpan.textContent = "X";
    removeSpan.addEventListener("click", () => removeCourse(i));

    listItem.appendChild(removeSpan);
    courseList.appendChild(listItem);
  }

  calculateGPA();
}

function handleScaleChange() {
  gradingScale = gradingScaleSelect.value;
  updateScaleDescription();
  calculateGPA();
  saveCourses();
}

loadSavedData();
gradingScaleSelect.value = gradingScale;
updateScaleDescription();
renderCourses();

courseForm.addEventListener("submit", addCourse);
gradingScaleSelect.addEventListener("change", handleScaleChange);
