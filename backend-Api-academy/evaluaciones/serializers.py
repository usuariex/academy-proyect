import rest_framework.serializers as serializers
from .models import CatEstadoEval, Evaluacion, CatEstadoEval, CatTipoEval, Ejercicio, ConfigTeorica

class CatEstadoEvalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='estado_id', read_only=True)
    nombre = serializers.CharField(source='estado_nombre')
    class Meta:
        model = CatEstadoEval
        fields = ['id', 'nombre']


class CatTipoEvalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='tipo_id', read_only=True)
    nombre = serializers.CharField(source='tipo_nombre')
    class Meta:
        model = CatTipoEval
        fields = '__all__'


class EjercicioSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='ejercicio_id', read_only=True)
    nombre = serializers.CharField(source='ejercicio_nombre')
    class Meta:
        model = Ejercicio
        fields = '__all__'

class ConfigTeoricaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='config_id', read_only=True)
    nombre = serializers.CharField(source='config_nombre')
    class Meta:
        model = ConfigTeorica
        fields = '__all__'

class EvaluacionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='evaluacion_id', read_only=True)
    programada = serializers.DateField(source='fecha_planificada')
    class Meta:
        model = Evaluacion
        fields = '__all_'