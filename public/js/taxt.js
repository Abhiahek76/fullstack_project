let text = document.getElementById("flexSwitchCheckDefault");
text.addEventListener("click", () => {
  let textinfo = document.getElementsByClassName("text-infos");
  for (alltext of textinfo) {
    //  alltext.style.disply = "inline";
    // console.log(alltext);
    if (alltext.style.display != "inline") {
      alltext.style.display = "inline";
    } else {
      alltext.style.display = "none";
    }
  }
});
