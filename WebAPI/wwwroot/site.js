const uri = "api/Product";
let todos = null;
function getCount(data) {
    const el = $("#counter");
    let name = "product";
    if (data) {
        if (data > 1) {
            name = "products";
        }
        el.text(data + " " + name);
    } else {
        el.text("No " + name);
    }
}

$(document).ready(function () {
    getData();
});

function getData() {
    $.ajax({
        type: "GET",
        url: uri,
        cache: false,
        success: function (data) {
            const tBody = $("#todos");

            $(tBody).empty();

            getCount(data.length);

            $.each(data, function (key, item) {
                const tr = $("<tr></tr>")
                    .append($("<td></td>").text(item.id))
                    .append($("<td></td>").text(item.name))
                    .append($("<td></td>").text(item.price))
                    .append(
                        $("<td></td>").append(
                            $("<button>Edit</button>").on("click", function () {
                                editItem(item.id);
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<button>Delete</button>").on("click", function () {
                                deleteItem(item.id);
                            })
                        )
                    );

                tr.appendTo(tBody);
            });

            todos = data;
        }
    });
}

function addItem() {

    const item = {
        name: $("#add-name").val(),
        price: $("#add-price").val()
    };
    if (item.name) {
        if (item.name.length <= 100) {
            $.ajax({
                type: "POST",
                accepts: "application/json",
                url: uri,
                contentType: "application/json",
                data: JSON.stringify(item),
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Something went wrong!");
                },
                success: function (result) {
                    getData();
                    $("#add-name").val("");
                    $("#add-price").val("0.00");
                }
            });
        }
        else {
            alert("Entered name can't have more than 100 characters!");
        }
    }
    else {
        alert("Enter product name!");
    }
}

function deleteItem(id) {
    $.ajax({
        url: uri + "/" + id,
        type: "DELETE",
        success: function (result) {
            getData();
        }
    });
}

function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {
            $("#edit-id").val(item.id);
            $("#edit-name").val(item.name);
            $("#edit-price").val(item.price);
        }
    });
    $("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function () {
    const item = {
        id: $("#edit-id").val(),
        name: $("#edit-name").val(),
        price: $("#edit-price").val()
    };

    if (item.id) {
        if (item.name.length <= 100) {
            $.ajax({
                url: uri + "/" + $("#edit-id").val(),
                type: "PUT",
                accepts: "application/json",
                contentType: "application/json",
                data: JSON.stringify(item),
                success: function (result) {
                    getData();
                }
            });
        }
        else {
            alert("Entered name can't have more than 100 characters!");
        }
    }

    else {
        alert("Id missing!");
    }
    closeInput();
    return false;
});

function closeInput() {
    $("#spoiler").css({ display: "none" });
}