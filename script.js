/* =========================
   OPEN SURPRISE BUTTON
========================= */

const openButton = document.getElementById("openWish");
const wishSection = document.querySelector(".wish-section");
openButton.addEventListener("click", function(){
    wishSection.scrollIntoView({
        behavior: "smooth"
    });
});
/* =========================
   TYPING EFFECT
========================= */
const message = 
"Some friendships are not about how long we know someone, but about how special they make our life feel.";
const paragraph = document.querySelector(".wish-section p");
let index = 0;
function typeEffect(){
    if(index < message.length){
        paragraph.innerHTML += message.charAt(index);
        index++;
        setTimeout(typeEffect,40);
    }
}
// Start typing when page loads
paragraph.innerHTML = "";
setTimeout(typeEffect,1000);
/* =========================
   FLOATING HEART EFFECT
========================= */
function createHeart(){
    const heart = document.createElement("div");
    heart.innerHTML = "💙";
    heart.style.position = "fixed";
    heart.style.left = Math.random()*100 + "vw";
    heart.style.bottom = "-20px";
    heart.style.fontSize =
    Math.random()*20 + 15 + "px";
    heart.style.animation =
    "moveHeart 5s linear";
    heart.style.zIndex = "999";
    document.body.appendChild(heart);
    setTimeout(()=>{
        heart.remove();
    },5000);
}
setInterval(createHeart,700);
