const style = document.createElement("link");
style.rel = "stylesheet";
style.href = chrome.runtime.getURL("popup.css");
document.head.appendChild(style);

console.log("DeV: Cargado 👿")

document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key === "s") {
        console.log("Alt+S presionado");
        const selectedText = window.getSelection().toString().trim();	
        if (selectedText) {
            chrome.runtime.sendMessage({
                action: "buscarRespuesta",
                texto: selectedText
            });
        } else {
            mostrarPopup("Selecciona un texto antes de usar Alt+S.");
        }
    }
});

document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key === "x"){
        const existingPopup = document.getElementById("respuestasPopup");
        if (existingPopup) existingPopup.remove();
    }
});

function mostrarPopup(mensaje) {
    const existing2Popup = document.getElementById("respuestasPopup");
    if (existing2Popup) {
        existing2Popup.remove();
    }
    const existingPopup = document.getElementById("popupAlerta");
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement("div");
    popup.id = "popupAlerta";
    popup.textContent = mensaje;
    popup.style.position = "fixed";
    popup.style.bottom = "10px";
    popup.style.right = "-300px";
    popup.style.padding = "10px 20px";
    popup.style.backgroundColor = "rgba(255, 0, 0, 0.08)";
    popup.style.color = "red";
    popup.style.borderRadius = "10px";
    popup.style.fontSize = "14px";
    popup.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    popup.style.transition = "right 0.5s ease-in-out, opacity 0.2s";
    popup.style.zIndex = "9999";

    popup.addEventListener("mouseover", () => {
        popup.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
        popup.style.color = "white";
    });
    popup.addEventListener("mouseout", () => {
        popup.style.backgroundColor = "rgba(255, 0, 0, 0.08)";
        popup.style.color = "red";
    });

    document.body.appendChild(popup);
    setTimeout(() => {
        popup.style.right = "10px";
    }, 50);

    setTimeout(() => {
        popup.style.right = "-300px"; 
        setTimeout(() => {
            popup.remove();
        }, 500); 
    }, 800);
}