from bs4 import BeautifulSoup
import json, re, os

def find_response_element(question) -> tuple:
    '''Función para extraer las opciones de respuesta de las preguntas (ul o img) -> tuple(str("ul"|"img"), element)'''

    next_element = question.find_next()
    if "Refer to the exhibit" in question.get_text(strip=True):
        while next_element and next_element.name != "ul":
            next_element = next_element.find_next()
        return "ul", next_element
    else:
        while next_element:
            if next_element.name == "ul":
                return "ul", next_element
            elif next_element.name == "img":
                if next_element.find_next().name == "ul":
                    return "ul", next_element.find_next("ul")
                elif next_element.find_next("div").has_attr("class") and "w3eden" in next_element.find_next("div")["class"]:
                        return "ul", next_element.find_next("ul")
                else:
                    return "img", next_element
            elif next_element.name in ["div", "br", "p", "strong", "pre", "span", "em"]:
                next_element = next_element.find_next()
            else:
                break

    return None, None

def find_questions(html_content) -> BeautifulSoup:
    '''Función para extraer las preguntas de los html'''

    soup = BeautifulSoup(html_content, 'html.parser')
    questions = []
    for q in soup.find_all(["strong", "b"], recursive=True):
        question_text = q.get_text(strip=True)
        if not re.match(r'^\d+\.\s', question_text):
            if "Refer to the exhibit" in question_text:
                questions.append(q)
            continue
        
        if "Consider the following command:" in question_text:
            questions.append(q)

            questions.append(q.find_next("pre"))
            if q.find_next("p").find_next().name == "strong":
                questions.append(q.find_next("p").find_next())
            elif q.find_next("p").find_next().name == "em":
                q = q.find_next("p").find_next()
                if q.find_next("p").find_next().name == "strong":
                    questions.append(q.find_next("p").find_next())
            else:
                questions.append(q.find_next("p"))
        else:
            questions.append(q)

    return questions

def remove_comments(html_content) -> str:
    '''Función para eliminar la sección de comentarios de los html'''

    soup = BeautifulSoup(html_content, 'html.parser')
    r = soup.find("div", id="wpdcom")
    if r:
        r.decompose()
    return str(soup)

def extract_data_from_html(html_content) -> list:
    '''Función para extraer los datos de las preguntas de los html'''

    questions_data = []
    questions = find_questions(html_content)
    for question in questions:
        question_text = question.get_text(strip=True)
        if not re.match(r'^\d+\.\s', question_text):
            if questions_data:
                questions_data[-1]["question"] += " " + question_text
                continue

        options = []
        correct_answers = []
        image_url = None
        
        response_type, response_element = find_response_element(question)
        
        if response_type == "ul":
            for li in response_element.find_all("li"):
                option_text = li.get_text(strip=True)
                options.append(option_text)
                if li.find("span", style=lambda value: value and "color: #ff0000" in value):
                    correct_answers.append(option_text)
                if li.get("class") and "correct_answer" in li["class"]:
                    correct_answers.append(option_text)

        elif response_type == "img":
            if response_element and response_element.get("src"):
                image_url = response_element["src"]

        questions_data.append({
            "question": question_text,
            "options": options if options else [],
            "correct_answers": correct_answers if correct_answers else [],
            "image_url": image_url
        })

    return questions_data

def process_html_files_in_folder(folder_path) -> list:
    '''Función para procesar todos los archivos html en un directorio'''

    all_questions = []

    for file_name in os.listdir(folder_path):
        if file_name.endswith(".html"): 
            file_path = os.path.join(folder_path, file_name)
            print(f"Procesando archivo: {file_path}")
            
            with open(file_path, "r", encoding="utf-8") as file:
                html_content = file.read()
                questions_data = extract_data_from_html(remove_comments(html_content))
                all_questions.extend(questions_data)

    return all_questions

def main():
    '''Función principal'''
    
    folder_path = "pages"
    all_questions = process_html_files_in_folder(folder_path)
    output_file = "respuesta.json"
    with open(output_file, "w", encoding="utf-8") as json_file:
        json.dump(all_questions, json_file, ensure_ascii=False, indent=4)

    print(f"Archivo {output_file} generado con éxito.")

if __name__ == "__main__":
    main()