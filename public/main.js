const hidebtn = document.querySelector("#hide");
const displaybtn = document.querySelector("#display");
const displayBox = document.querySelector("#display-box");
hidebtn.onclick = (event) => {
  event.target.className = "hidden";
  displayBox.className = "hidden";
  displaybtn.style.display = "block";
};

displaybtn.onclick = (event) => {
  event.target.style.display = "none";
  hidebtn.className = "btn";
  displayBox.className = "";
};
/* I used onchange for the checkboxes in the home page */
