// Color in cells when a team gets a match
document.addEventListener("DOMContentLoaded", function() {
    // Get all rows from the table
    var table = document.getElementById("runs_given_up_table");
    console.log(table);
    if (table) {
        var rows = table.getElementsByTagName("tr");

        // Make cells colored in if value is greater than or equal to 1
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].getElementsByTagName("td");
            //exclude Games and Matches columns
            for (var j = 0; j < cells.length-2; j++) {
                if (parseInt(cells[j].innerText) >= 1) {
                    cells[j].style.backgroundColor = "#2CC698";
                    cells[j].style.color = "black";
                }
            }
        }

    } else {
        console.error("Table with ID 'runs_given_up_table' not found.");
    }
});

