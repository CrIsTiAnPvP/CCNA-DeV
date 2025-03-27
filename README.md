# CCNA DeV :smiling_imp: - Cisco Exam Helper

## Descripción

Este proyecto se enfoca en dos partes:

1. Una extensión de navegador
2. Un parser HTML en python

Este proyecto consiste en la realización de una herramienta la cual se pueda usar para poder prepararse de forma más optima los examenes de Cisco CCNA.

## Características

- **Búsqueda Contextual**: Selecciona texto y utiliza el menú contextual para buscar los datos de tu pregunta.
- **Parser Integrado**: Extrae preguntas y respuestas de archivos HTML, de tus propios archivos (Se pueden obtener de webs como [ITExamAnswers](https://itexamanswers.net/))
- **Facilidad para Estudiantes**: Herramienta diseñada para ayudar con la preparación de los exámenes de Cisco.

## Requisitos

- Navegador compatible con extensiones (Chrome, Firefox, ...).
- Archivos HTML de para el Parser (Hay algunos provistos).

## Instalación

1. Clona este repositorio.

- En Chrome (Recomendado)

	1. Abre Chrome y ve a `chrome://extensions/`.
	2. Activa el "Modo de desarrollador" en la esquina superior derecha.
	3. Haz clic en "Cargar descomprimida" y selecciona la carpeta `Extension` del repositorio clonado.
	4. La extensión ahora estará instalada y lista para usar.

- En Firefox

	1. Abre Firefox y ve a `about:debugging#/runtime/this-firefox`.
	2. Haz clic en "Cargar complemento temporal".
	3. Selecciona el archivo `manifest.json` dentro de la carpeta del repositorio clonado.
	4. La extensión ahora estará instalada y lista para usar.

### Configuración de Python para el Parser

1. Asegúrate de tener Python 3.10 instalado. Puedes descargarlo desde [python.org](https://www.python.org/).
2. Instala las dependencias necesarias ejecutando el siguiente comando en tu terminal:
	```bash
	pip install -r requirements.txt
	```
3. Coloca los archivos HTML de ITExamAnswers en la carpeta `Parser/Pages` para que el Parser pueda procesarlos.
4. Ejecuta el parser con:
	```bash
	python main.py
	```

## Uso

1. Utiliza el Parser para extraer preguntas y respuestas, de archivos con las mismas.
2. Guarda el archivo `JSON` generado por el `Parser`, en la carpeta de la extensión. Este archivo contendrá las preguntas y respuestas extraídas.
3. Si has cargado la extensión recárgala o vuelve a abrir tu navegador.
4. Selecciona un texto de una pregunta de Cisco.
5. Haz clic derecho y utiliza el menú contextual para buscar información sobre el texto seleccionado.
5.1 También puedes usar la combinación de teclas `Alt+S` para buscar información sobre el texto seleccionado.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Propósito del Proyecto

Este proyecto ha sido creado con motivos educativos y enfocado a la ayuda en ámbito no calificativo es decir, en aquel el cual no involucre ninguna calificación por su parte. No me hago responsable del uso que se le de a esta herramienta ni de los fines con los cuales se comparta.
