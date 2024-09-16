export function closePopup(popup) {
  popup.classList.add("popup_inactive");
  popup.addEventListener("animationend", animationend => {
    if (animationend.animationName === "popup-fade-out") {
      popup.remove();
    }
  });
}

export function onPopupCancelBtnCLick(click) {
  const btn = click.currentTarget;
  const popup = btn.closest(".popup");
  closePopup(popup);
}