from django.contrib import admin

from .models import (
    Evaluation, EvaluationStatus, EvaluationType, EvaluationStudent,
    Exercise, TheoryConfig, TheoryEvaluation, PhysicalEvaluation,
    TheoryEvaluationConfig, FixedCriteria, RangeCriteria
)

admin.site.register(Evaluation)
admin.site.register(EvaluationStatus)
admin.site.register(EvaluationType)
admin.site.register(EvaluationStudent)
admin.site.register(Exercise)
admin.site.register(TheoryConfig)
admin.site.register(TheoryEvaluation)
admin.site.register(PhysicalEvaluation)
admin.site.register(TheoryEvaluationConfig)
admin.site.register(FixedCriteria)
admin.site.register(RangeCriteria)
