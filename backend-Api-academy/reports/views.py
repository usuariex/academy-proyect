from students.models import Student
from evaluations.models import EvaluationStudent
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from .services import generate_academic_report_pdf


class AcademicReportView(APIView):
    def get(self, request):
        # Obtener parámetros de la query
        student_uuid = request.query_params.get("student_id")
        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")
        output = request.query_params.get("output", "json")

        # Validar existencia de parámetros
        if not student_uuid or not start_date_str or not end_date_str:
            return Response({"error": "Missing required parameters"}, status=400)

        # Parsear fechas
        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)

        # Validar formato correcto de fechas
        if not start_date or not end_date:
            return Response({"error": "Invalid date format, use YYYY-MM-DD"}, status=400)

        # Buscar estudiante
        try:
            student = Student.objects.get(uuid=student_uuid)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=404)

        # Filtrar evaluaciones
        evaluations = EvaluationStudent.objects.select_related("evaluation__type").filter(
            student=student,
            evaluation__planned_date__range=(start_date, end_date)
        )

        theory_evals, physical_evals = [], []

        for es in evaluations:
            eval_type = es.evaluation.type.type_name.strip().lower()
            record = {
                "date": es.evaluation.planned_date.strftime("%d/%m/%Y"),
                "description": es.evaluation.description,
                "grade": float(es.get_grade) if es.get_grade else None
            }
            if "teorica" in eval_type:
                theory_evals.append(record)
            elif "fisica" in eval_type:
                physical_evals.append(record)

        # Resumen de evaluaciones teóricas
        grades = [t["grade"] for t in theory_evals if t["grade"] is not None]
        summary = {
            "average": round(sum(grades) / len(grades), 2) if grades else None,
            "min": min(grades) if grades else None,
            "max": max(grades) if grades else None
        }

        # Construir respuesta
        data = {
            "student": {
                "uuid": str(student.uuid),
                "name": student.first_name,
                "national_id": student.national_id,
            },
            "start_date": start_date_str,
            "end_date": end_date_str,
            "theory_evaluations": theory_evals,
            "physical_evaluations": physical_evals,
            "summary": summary
        }

        # Generar PDF si se solicita
        if output == "pdf":
            pdf_bytes = generate_academic_report_pdf(data)
            response = HttpResponse(pdf_bytes, content_type="application/pdf")
            response["Content-Disposition"] = f'attachment; filename="report_{student.national_id}.pdf"'
            return response

        return Response(data)
