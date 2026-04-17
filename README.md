Decisiones de Diseño:

	Base de Datos:

		Se eligió MySQL porque permite trabajar con transacciones y bloqueo a nivel de fila, lo cual es importante para mantener la consistencia al procesar pagos concurrentes.

	Estrategia de Concurrencia:
	
		Se utilizan transacciones SQL junto con SELECT ... FOR UPDATE para bloquear el registro del usuario mientras se valida y actualiza el saldo. De esta forma, si llegan múltiples solicitudes al mismo tiempo para un mismo usuario, solo una puede modificar el saldo a la vez, evitando condiciones de carrera y saldos inconsistentes.

	Explicación del Diagrama:

		Se propone una arquitectura escalable para una gran magnitud de peticiones utilizando servicios de AWS. Las solicitudes ingresan a través de un API Gateway, que actúa como punto de entrada, y son distribuidas por un Load Balancer hacia una o varias instancias EC2 donde corre el backend en Node.js (Koa). La base de datos se gestiona con Amazon RDS (MySQL), lo que permite manejar transacciones y administración básica. Para optimizar la idempotencia y reducir la carga sobre la base de datos, se incorpora Redis como cache, permitiendo consultas rápidas de payment_id previos. Además, se integra un sistema de colas (Amazon SQS) para manejar las solicitudes de pago de manera asíncrona. Esto permite procesar las transacciones de forma ordenada y controlada, reduciendo la necesidad de bloqueos directos en la base de datos, los cuales pueden volverse un cuello de botella bajo alta concurrencia. De esta manera, se minimizan las condiciones de carrera y se mejora la escalabilidad del sistema.