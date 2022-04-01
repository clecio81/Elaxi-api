// ano atual
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.getElementById("displayYear").innerHTML = currentYear;
}

getYear();