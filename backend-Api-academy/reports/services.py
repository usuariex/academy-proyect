from django.template.loader import render_to_string
from django.contrib.staticfiles import finders
from weasyprint import HTML, CSS

def generate_academic_report_pdf(data):
    html_string = render_to_string("reports/academic_report.html", data)

    # Busca el archivo CSS en staticfiles
    css_path = finders.find('reports/report.css')

    pdf_file = HTML(string=html_string).write_pdf(
        stylesheets=[CSS(css_path)] if css_path else None
    )
    return pdf_file

