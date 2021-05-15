var current_url = "";

function runExtension() {
    current_url = document.location.origin + document.location.pathname + document.location.search;

    switch (true) {
        case /https:\/\/scholar\.google\.[a-z]{2,3}(\.[a-z]{2,3})?\/scholar/.test(current_url):
            document.addEventListener("DOMContentLoaded", function(event){
                handleScholar();
            }, false)
            break;
            
        case /https:\/\/www\.google\.[a-z]{2,3}(\.[a-z]{2,3})?\/search/.test(current_url):
            document.addEventListener("DOMContentLoaded", function(event){
                handleGoogle();
            }, false)
            break;

        default:
            break;
    }
}

function handleScholar(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let get_first_cite = urlParams.get('get_first_cite');
    let body = document.querySelector("body");
    let body_display = body.style.display
    try{
        if (get_first_cite){
            let first_paper = document.querySelector("h3.gs_rt");
            let cite_url = first_paper.parentElement.children[3].children[2].href
            if (cite_url.includes("cites")){
                body.style.display = "none"
                window.location.replace(cite_url)
                return
            }
        }
    } catch(err){
        console.log(err)
    }
    body.style.display = body_display
}

function handleGoogle(){
    var paper_title_node_list = document.querySelectorAll("div.g > div > div a > h3");

    var i;
    for(i=0;i<paper_title_node_list.length;i++){
        let paper_title_node = paper_title_node_list[i].parentElement.parentElement;
        
        let main_element = paper_title_node.parentElement;
        let descriptions = main_element.children[1].children[0]; 
        
        let paper_url = paper_title_node_list[i].parentElement.href;

        if (descriptions.childElementCount == 2){
            console.log(descriptions.children[0])
            if (descriptions.children[0].childElementCount >= 2 && descriptions.children[0].innerHTML.includes("·")){
                let cited_by = descriptions.children[0].children[descriptions.children[0].childElementCount - 1];
                // Check if is year
                if (cited_by.innerHTML.length != 4){
                    let a_cited_by = document.createElement('a');
                    a_cited_by.setAttribute('href', getCitePage(paper_url));
                    a_cited_by.innerHTML = cited_by.innerHTML;
                    cited_by.replaceWith(a_cited_by);
                }
            }
            
            if (/https:\/\/arxiv\.org\/abs/.test(paper_url)){
                let pdf_link = document.createElement('a');
                pdf_link.setAttribute('href', paper_url.replace("\/abs\/", "\/pdf\/"))
                pdf_link.innerHTML = "PDF ";
                let html = descriptions.children[0].innerHTML;
                html = html.split(">");
                let html_last = html.pop().slice(1);
                html = html.join(">") + ">" + " / ";
                descriptions.children[0].innerHTML = html;
                descriptions.children[0].insertBefore(pdf_link, descriptions.children[0].children[3])
                descriptions.children[0].innerHTML = descriptions.children[0].innerHTML + html_last;
            }
        }
    }
}

function getCitePage(search_query) {
    let base_url = "https://scholar.google.com/scholar?q=";
    let url = base_url + search_query + "&get_first_cite=true"    
    return url;
}

runExtension()
