// Module for popup modal functionality

export function initPopupModal() {
	const POPUP_MODAL = document.getElementById("popupModal");
	const POPUP_FORM = document.querySelector("#popupModal form");
	const POPUP_BACKDROP = document.getElementById("popupBackdrop");

	// Show popup modal after 10 seconds
	setTimeout(() => {
		const MODAL = bootstrap.Modal.getOrCreateInstance(POPUP_MODAL);
		MODAL.show();
	}, 10000);

	// Show/hide gradient backdrop with modal
	POPUP_MODAL.addEventListener("show.bs.modal", () => {
		POPUP_BACKDROP.style.display = "block";
		setTimeout(() => {
			POPUP_BACKDROP.style.opacity = '1';
		}, 100); 
	});

	POPUP_MODAL.addEventListener("hidden.bs.modal", () => {
    document.getElementById("popupClose").blur();
		POPUP_BACKDROP.style.opacity = '0';
		setTimeout(() => {
			POPUP_BACKDROP.style.display = "none";
		}, 1000); 
	});

  // Handle form submission
	POPUP_FORM.addEventListener("submit", (e) => {
		e.preventDefault();
		const EMAIL = document.getElementById("loginEmail").value;
		// TODO Handle email signup logic here
		console.log("Form submitted:", { EMAIL });

		// Clear form and close modal
		POPUP_FORM.reset();
		bootstrap.Modal.getInstance(POPUP_MODAL).hide();
	});
}