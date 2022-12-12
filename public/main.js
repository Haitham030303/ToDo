const checkboxes = document.querySelectorAll(".task-checkbox");

for (const checkbox of checkboxes) {
  checkbox.onchange = (event) => {
    let myCheckbox = event.target;
    myCheckbox.style.display = "none";
  };
}
