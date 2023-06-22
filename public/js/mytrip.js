$(".delete-trip-btn").click(function (event) {
  event.preventDefault();
  const tripId = $(this).attr("data-trip-id");
  const deleteUrl = "/deletetrip/" + tripId;
  const confirmDelete = confirm("Are you sure you want to delete this trip?");
  const tripItem = $(event.target).closest(".trip-item");

  if (confirmDelete) {
    $.ajax({
      type: "DELETE",
      url: deleteUrl,
      success: function (response) {
        tripItem.fadeTo(1000, 0.01, function () {
          $(this).slideUp(150, function () {
            $(this).remove();
            // Reorder trips
            // const tripItems = $('.package-item');
            // tripItems.each(function (index) {
            //     $(this).delay(200 * index).fadeIn(500);
            // });
          });
        });
      },
      error: function (error) {
        console.error("Error deleting trip:", error);
      },
    });
  }
});
