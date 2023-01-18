import Swal from "sweetalert2";
export default function MySweetAlert() {
  // Delete & Confirmation ------------
  const deleteConfirmationHandler = async (authorId) => {
    Swal.fire({
      title: "Error!",
      text: `${authorId} Do you want to continue`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      console.log(result);
      return result;
    });
  };

  return { deleteConfirmationHandler };
}
