let sectionCount = 0;
let imageDataURL = '';
let pageName = 'default';

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{
        'header': 1
    }, {
        'header': 2
    }], // custom button values
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }, {
        'list': 'check'
    }],
    [{
        'script': 'sub'
    }, {
        'script': 'super'
    }], // superscript/subscript
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }], // outdent/indent
    [{
        'direction': 'rtl'
    }], // text direction

    [{
        'size': ['small', false, 'large', 'huge']
    }], // custom dropdown
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }],

    [{
        'color': []
    }, {
        'background': []
    }], // dropdown with defaults from theme
    [{
        'font': []
    }],
    [{
        'align': []
    }],

    ['clean'] // remove formatting button
];

const date = document.getElementById('currentYear');
if (date) date.textContent = new Date().getFullYear();

const addBtn = document.getElementById('addSectionBtn');
if (addBtn) addBtn.addEventListener('click', () => {
    sectionCount++;
    const container = document.getElementById('sections');
    const containerDiv = document.createElement('div');

    containerDiv.innerHTML = `
			<div class="row mb-4">
				<div class="col-12">
					<div class="input-group">
						<span class="input-group-text">Section ${sectionCount} Title</span>
						<input
							type="text"
							class="form-control"
							id="sectionName${sectionCount}"
							aria-describedby="nameHelp"
							placeholder="Enter Section ${sectionCount} Name"
						>
					</div>
				</div>
			</div>
			<div class="mb-4" id="section${sectionCount}"></div>`

    container.appendChild(containerDiv);


    const quill = new Quill(`#section${sectionCount}`, {
        modules: {
            toolbar: toolbarOptions,
        },
        placeholder: 'Add Section Information',
        theme: 'snow'
    });
});

const fileInput = document.getElementById('mainImage');
if (fileInput) fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        imageDataURL = event.target.result;
        console.log('Loaded imageDataURL:', imageDataURL);
    };
    reader.readAsDataURL(file);
});

const genBtn = document.getElementById('generateBtn');
if (genBtn) genBtn.addEventListener('click', () => {

    pageName = document.getElementById('itemName').value;
    const quote = document.getElementById('flavorQuote').value;
    const quoteName = document.getElementById('quoteName').value;
    const sections = document.getElementById('sections');

    const file = document.getElementById('mainImage').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imageDataURL = reader.result;
        };
        reader.readAsDataURL(file);
    }

    let content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/x-icon" href="sp.png">
  <title>${pageName}</title>
</head>
<body>
	<link rel="stylesheet" href="style.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">

	<header>
	</header>
	<div class="wrapper">
		<main>
			<div class="main-content">
				<h1 class="mb-4">${pageName}</h1>`

    if (quote) {
        content += `
		  <div class="row justify-content-center align-items-center mb-4">
			<div class="${imageDataURL ? 'col-8' : 'col'} text-center">
			  <em class="center"><i>“${quote}”</i></em>
			  <em><i class="f-end">~ ${quoteName || 'unknown'}</i></em>
			</div>
		</div>
			${imageDataURL ? `
				<img src="${imageDataURL}" class="main-image" />
			` : ''}
`;
    }

    Array.from(sections.children).forEach((child, idx) => {
        let sectionName = 'TBD'
        const sectionNameControl = document.getElementById(
            `sectionName${idx+1}`);
        if (sectionNameControl) sectionName = sectionNameControl
            .value

        const editorControl = child.querySelector('.ql-editor');
        if (editorControl) {
            content += `
			<h2>${sectionName}</h2>
			${editorControl.innerHTML}
			`
        } else {
            content += `
			<h2>${sectionName}</h2>
			<span>TBD<span>
			`
        }

    });

    content += `
		</div>
		</main>
		<footer>
			<p>&copy; <date id="currentYear"></date> Site by Millianna <3. All rights reserved.</p>
		</footer>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
		<script src="https://cdn.jsdelivr.net/npm/js-beautify@1.14.7/js/lib/beautify.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.3/beautify-html.min.js"></script>
		<script src="TemplateBuilder.js"></script>
	</div>
</body>
</html>`

    const prettyHtml = getPrettyHTML(content);

    if (confirm('Do you want to download the HTML file?')) downloadHTML(
        prettyHtml);
    else return;
});

function downloadHTML(content) {
    const blob = new Blob([content], {
        type: 'text/html'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageName.toLowerCase()}.html`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const pageList = ["Index", "TemplateBuilder", "Surgeborn"];

document.addEventListener('DOMContentLoaded', () => {
    const headerHTML = `
    <nav class="navbar navbar-expand-xs navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
			<img src="sp.png" alt="Logo" width="35" height="35" class="d-inline-block align-text-top">
			SpacePunk
		</a>
        <button class="navbar-toggle float-end bg-dark" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#mainNav"
                aria-controls="mainNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto">
            ${
              pageList
                .map(x => `
                  <li class="nav-item" id="page-${x}">
                    <a class="nav-link" href="${x.toLowerCase()}.html">${x}</a>
                  </li>
                `)
                .join('')
            }
          </ul>
        </div>
      </div>
    </nav>
`;

    // Inject the header
    const container = document.getElementById('site-header');
    container.innerHTML = getPrettyHTML(headerHTML);

    // Optional: explicitly initialize the collapse component
    const collapseEl = document.getElementById('mainNav');
    if (collapseEl) {
        new bootstrap.Collapse(collapseEl, {
            toggle: false
        });
    }
});

function getPrettyHTML(content) {
    return html_beautify(content, {
        "indent_size": "4",
        "indent_char": " ",
        "max_preserve_newlines": "5",
        "preserve_newlines": true,
        "keep_array_indentation": false,
        "break_chained_methods": false,
        "indent_scripts": "normal",
        "brace_style": "none,preserve-inline",
        "space_before_conditional": true,
        "unescape_strings": false,
        "jslint_happy": false,
        "end_with_newline": false,
        "wrap_line_length": "80",
        "indent_inner_html": true,
        "comma_first": false,
        "e4x": false,
        "indent_empty_lines": false
    });
}