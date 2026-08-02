const openButton = document.getElementById("openWish");
const wishSection = document.querySelector(".wish-section");
const music = document.getElementById("bgMusic");


openButton.addEventListener("click", function () {

    // Music start
    if (music) {
        music.play();
    }


    // Name change
    const nameInput = document.getElementById("friendName");
    const friendName = document.querySelector(".wish-section h3");


    if (nameInput && nameInput.value.trim() !== "") {

        friendName.innerHTML =
            "Dear " + nameInput.value + " 💙";

    } else {

        friendName.innerHTML =
            "Dear Friend 💙";

    }


    // Confetti
    createConfetti();


    // Auto scroll
    wishSection.scrollIntoView({
        behavior: "smooth"
    });


});



function createConfetti(){

    for(let i = 0; i < 100; i++){

        const confetti = document.createElement("div");

        confetti.className = "confetti";

        confetti.style.left =
        Math.random() * 100 + "vw";

        confetti.style.background =
        "hsl(" + Math.random()*360 + ",100%,50%)";


        confetti.style.animationDuration =
        (Math.random()*3+2) + "s";


        document.body.appendChild(confetti);


        setTimeout(()=>{

            confetti.remove();

        },5000);

    }

}
