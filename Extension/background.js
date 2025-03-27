chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "ccnaMenu",
        title: "DeV 😉",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "ccnaMenu") {
        chrome.scripting.executeScript({
			target: { tabId: tab.id },
            func: obtenerRespuesta,
            args: [info.selectionText]
        });
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "buscarRespuesta") {
        chrome.scripting.executeScript({
			target: { tabId: sender.tab.id },
            func: obtenerRespuesta,
            args: [message.texto]
        });
    }
});

async function obtenerRespuesta(textoSeleccionado) {
	function capitalizeFirstLetter(text) {
		return text.charAt(0).toUpperCase() + text.slice(1);
    } try {
        function alertpopup(mensaje) {
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
            popup.style.color = "lightblue";
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
        };
        const jsonUrl = chrome.runtime.getURL("respuesta.json");
        const response = await fetch(jsonUrl);
        const data = await response.json();
        const preguntaData = data.find((item) => {
            return item.question.includes(textoSeleccionado) ||
                textoSeleccionado.includes(item.question);
        });

        if (!preguntaData) {
            alertpopup("No se encontró una respuesta para la pregunta seleccionada.");
            return;
        }

        const existingPopup = document.getElementById("respuestasPopup");
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement("div");
        popup.id = "respuestasPopup";
        popup.classList.add("popup");

        let titleText = preguntaData.question;
        const titleWordLimit = 6;
        let titleWords = titleText.split(" ");

        if (titleWords.length > titleWordLimit) {
            titleWords = titleWords.slice(0, titleWordLimit);
            titleText = titleWords.join(" ") + "...";
        }

        const title = document.createElement("p");
        title.textContent = titleText;
        title.classList.add("popup-title");
        popup.appendChild(title);

        if (preguntaData.image_url) {
            const img = document.createElement("img");
            img.src = preguntaData.image_url;
            img.alt = "Respuesta visual";
            img.style.maxWidth = "100%";
            popup.appendChild(img);
        } else {
            const list = document.createElement("ul");
            preguntaData.options.forEach((option) => {
                const li = document.createElement("li");
                li.textContent = capitalizeFirstLetter(option);
                if (preguntaData.correct_answers.includes(option)) {
                    li.classList.add("correct-answer");
                }
                list.appendChild(li);
            });
            popup.appendChild(list);
        }

        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.classList.add("popup-close");
        closeButton.onclick = () => popup.remove();
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    } catch (error) {
        console.error("Error al obtener las respuestas:", error);
        alertpopup("Ocurrió un error al buscar la respuesta.");
    }
}