from django.template.loader import render_to_string
from weasyprint import HTML

def render_report_to_pdf(data):
    html_string = render_to_string("reports/academic_report.html", data)
    pdf_file = HTML(string=html_string).write_pdf()
    return pdf_file
