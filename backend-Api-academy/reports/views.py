from alumnos.models import Alumno
from evaluaciones.models import EvaluacionAlumno
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from .services import generate_academic_report_pdf


class AcademicReportView(APIView):
    def get(self, request):
        alumno_uuid = request.query_params.get("alumno_id")
        fecha_inicio = parse_date(request.query_params.get("fecha_inicio"))
        fecha_fin = parse_date(request.query_params.get("fecha_fin"))
        output = request.query_params.get("output", "json")

        if not alumno_uuid or not fecha_inicio or not fecha_fin:
            return Response({"error": "Faltan parámetros obligatorios"}, status=400)

        try:
            alumno = Alumno.objects.get(alumno_uuid=alumno_uuid)
        except Alumno.DoesNotExist:
            return Response({"error": "Alumno no encontrado"}, status=404)

        evaluaciones = EvaluacionAlumno.objects.select_related("evaluacion__tipo").filter(
            alumno=alumno,
            evaluacion__fecha_planificada__range=(fecha_inicio, fecha_fin)
        )

        simulacros, fisicas = [], []

        for ea in evaluaciones:
            tipo = ea.evaluacion.tipo.tipo_nombre.strip().lower()
            registro = {
                "fecha": ea.evaluacion.fecha_planificada.strftime("%d/%m/%Y"),
                "descripcion": ea.evaluacion.descripcion,
                "nota": float(ea.calificacion_final) if ea.calificacion_final else None
            }
            if "teorica" in tipo:
                simulacros.append(registro)
            elif "fisica" in tipo:
                fisicas.append(registro)

        # Resumen de simulacros
        notas = [s["nota"] for s in simulacros if s["nota"] is not None]
        resumen = {
            "promedio": round(sum(notas) / len(notas), 2) if notas else None,
            "minimo": min(notas) if notas else None,
            "maximo": max(notas) if notas else None
        }

        data = {
            "alumno": alumno,
            "fecha_inicio": fecha_inicio,
            "fecha_fin": fecha_fin,
            "simulacros": simulacros,
            "fisicas": fisicas,
            "resumen": resumen
        }

        if output == "pdf":
            pdf_bytes = generate_academic_report_pdf(data)
            response = HttpResponse(pdf_bytes, content_type="application/pdf")
            response["Content-Disposition"] = f'attachment; filename="reporte_{alumno.dni}.pdf"'
            return response

        return Response(data)
